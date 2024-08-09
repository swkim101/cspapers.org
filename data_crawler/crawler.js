const dblp = require('./dblp');
const fs = require('fs/promises')
const fsSync = require('fs')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const pick = (n = 0, arr = []) => arr.filter((_, i) => i < n)

const UNIT = "li.inproceedings"
const TITLE = "cite > span.title" // trailing . should be removed.
const DOI = "nav > ul > li > div.body > ul > li.ee > a"
const KEY = fsSync.readFileSync('./secret/semantics_scolar', { encoding: 'utf-8' })

const headers = {
  'x-api-key': KEY
}

const isDoi = (str = "") => str.startsWith("https://doi.org/")
const urlToDoi = (url = "") => url.replace("https://doi.org/", "")

/**
 * 
 * @param {string} url 
 * @return {Promise <[[ { title: string, doi: string | null }], Error | null]>}
 */
const crawlDblp = async (url) => {
  const res = await fetch(url)
  if (!res.ok) {
    return [{}, [new Error(`${url} responses ${res.status}`)]]
  }
  const html = await res.text()
  if (html.length < 10) {
    return [{}, [new Error(`wrong html returned ${html}`)]]
  }
  const document = (new JSDOM(html)).window.document
  const units = document.querySelectorAll(UNIT)
  if (units.length === 0) {
    return [[], [new Error(`no unit ${UNIT} ${url}`)]]
  }

  let ret = []
  let errors = []
  for (unit of units) {
    const title = unit.querySelector(TITLE)?.textContent?.trim()
    if (!title) {
      errors.push(new Error(`cannot find title for ${conference.url} ${TITLE}`))
      continue
    }
    const doiurl = unit.querySelector(DOI)?.getAttribute("href") || ""
    const doi = isDoi(doiurl) ? urlToDoi(doiurl) : ""

    const newTitle = title.replace(/\.$/, "")

    ret.push({
      title: newTitle,
      doi,
    })
  }

  return [ret, errors]
};

/**
 * 
 * @param {string} paperid - can be doi, paper id, ...
 * @return {[{ title: string, abstract: string | null }, number | null ]}
 */
const crawlDoi = async (paperid) => {
  const endp = `https://api.semanticscholar.org/graph/v1/paper/${paperid}?fields=title,abstract`
  const res = await fetch(endp, { headers })
  if (!res.ok) {
    return [{}, res.status]
  }
  const json = await res.json()
  return [{
    title: json.title,
    abstract: json.abstract,
  }, null]
};

/**
 * 
 * @param {string} title 
 * @return {[doi, Error | null ]}
 */
const crawlIdByTitle = async (title) => {
  const endp = `https://api.semanticscholar.org/graph/v1/paper/search?query=${title}&limit=1`
  const res = await fetch(endp, { headers })
  if (!res.ok) {
    return [{}, new Error(`${title} responses ${res.status}`)]
  }
  const json = await res.json()
  if (json.total === 0) {
    return [{ title, abstract: null }, null]
  }

  return [json.data[0].paperId, null]
}

/**
 * 
 * @param {string} path 
 * @return {boolean}
 */
const isEmpty = path => {
  const stat = fsSync.statSync(path)
  return stat.size === 0
}

/**
 * 
 * @param {string} path 
 * @return {boolean}
 */
const exists = (path) => fsSync.existsSync(path)

/**
 * No overwrite. Save only if the file is empty
 * @param {number} year 
 * @param {string} venue 
 * @param {string} title 
 * @param {string} abstract 
 * @returns {Promise<Error | null>}
 */
const save = async (year, venue, title, abstract) => {
  // const fs = {
  //   mkdir: console.log,
  //   writeFile: console.log,
  // }
  // const fs = {
  //   mkdir: nop,
  //   writeFile: nop,
  // }
  const newTitle = title.replaceAll("/", " ")
  const filepath = `data/${year}/${venue}/${newTitle}`
  let err = await fs.mkdir(`data/${year}/${venue}`, { recursive: true })
  if (err !== undefined) { return err }

  if (!exists(filepath) || isEmpty(filepath)) {
    err = await fs.writeFile(filepath, abstract)
    if (err !== undefined) { return err }
  }

  return null
}

/**
 * sleep msec
 * @param {msec} msec
 * @returns 
 */
const sleep = async (msec) => await new Promise(resolve => setTimeout(resolve, msec));

(async () => {
  let failed = []
  let dblpQ = dblp.map(e => e)
  let semanticsScolarQ = []
  let succeed = 0

  const runDblp = async () => {
    // Skip if semantics scholar q is large.
    if (20 < semanticsScolarQ.length) {
      return
    }
    // confernce := <- dblpQ
    if (dblpQ.length === 0) { return; }
    const conference = dblpQ.pop()

    const [papers, errs] = await crawlDblp(conference.url)
    if (0 < errs.length) {
      console.error(`${errs.length} errors in ${conference.url}. Pick 3:`)
      console.error(pick(3, errs))
    }

    papers
    .filter(({ title, doi }) => {
      const newTitle = title.replaceAll("/", " ")
      const filepath = `data/${conference.year}/${conference.name}/${newTitle}`
      return !exists(filepath) || isEmpty(filepath)
    })
    .map(({ title, doi }) =>
      // semanticsScolarQ <- { title, doi }
      semanticsScolarQ = [
        { year: conference.year, name: conference.name, title, doi },
        ...semanticsScolarQ
      ]
    )
  }

  const runSemanticScholar = async () => {
    // paper := <- semanticsScolarQ
    if (semanticsScolarQ.length === 0) { return; }
    const { year, name, title, doi } = semanticsScolarQ.pop()

    // get semantic scholar ID and re-queue
    if (!doi) {
      const [id, err] = await crawlIdByTitle(title)
      if (err !== null) {
        console.log(err)
        failed.push([title, doi])
      }
      semanticsScolarQ = [
        { year, name, title, doi: id },
        ...semanticsScolarQ
      ]
      return
    }

    const [paper, statusCode] = await crawlDoi(doi)

    if (statusCode !== null) {
      console.log(`${doi} responses ${statusCode}`)
      switch (statusCode) {
      // cannot find paper by DOI. Try semantic scholar ID
      case 404:
        console.log("404 requeue ", title)
        semanticsScolarQ = [
          { year, name, title, doi: null },
          ...semanticsScolarQ
        ]
        break;

      // Too frequent requests. Just requeue.
      case 429:
        console.log("429 requeue ", title)
        semanticsScolarQ = [
          { year, name, title, doi },
          ...semanticsScolarQ
        ]
        break;

      default:
        failed.push([title, doi])
      }
      return
    }
    {
      const err = await save(year, name, paper.title, paper.abstract || "")
      if (err !== null) {
        failed.push([title, doi])
      } else {
        succeed += 1
      }
    }
  }

  const dblpWorker = setInterval(runDblp, 3000);
  const semanticScholarWorker = setInterval(runSemanticScholar, 1050);

  while (true) {
    await sleep(3000)

    console.log(`dblp ${dblpQ.length} scholar ${semanticsScolarQ.length} succeed ${succeed} failed ${failed.length}`)
    fsSync.writeFileSync("./data_crawler/failed.json", JSON.stringify(failed, null, 2))
    if (dblpQ.length === 0) {
      // 10 sec room
      await sleep(10_000)
      if (semanticsScolarQ.length === 0 && dblpQ.length === 0) {
        // all queues are empty
        clearInterval(dblpWorker)
        clearInterval(semanticScholarWorker)
        console.log(JSON.stringify(failed, null, 2))
        process.exit(0)
      }
    }
  }
})();