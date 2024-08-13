const fsSync = require('fs')
const jsdom = require("jsdom");
const levenshtein = require('js-levenshtein');
const { JSDOM } = jsdom;

const pick = (n = 0, arr = []) => arr.filter((_, i) => i < n)

const toFilePath = (year, venue, title) => `data/${year}/${venue}/${title.replaceAll("/", " ")}`

const UNIT = 'li[itemtype="http://schema.org/ScholarlyArticle"]'
const TITLE = "cite > span.title" // trailing . should be removed.
const DOI = "nav > ul > li > div.body > ul > li.ee > a"
const KEY = fsSync.readFileSync('./secret/semantics_scolar', { encoding: 'utf-8' })

const headers = {
  'x-api-key': KEY
}

const isDoiUrl = (str = "") => str.startsWith("https://doi.org/")
const isDoi = (str = "") => /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(str)
const urlToDoi = (url = "") => url.replace("https://doi.org/", "")

/**
 * 
 * @param {string} url 
 * @return {Promise <[[ { title: string, doi: string | null }], Error | null]>}
 */
const crawlDblp = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!res.ok) {
    return [{}, [new Error(`3 - ${url} responses ${res.status}`)]]
  }
  const html = await res.text()
  if (html.length < 10) {
    return [{}, [new Error(`wrong html returned ${html}`)]]
  }
  const document = (new JSDOM(html)).window.document
  const units = document.querySelectorAll(UNIT)
  if (units.length === 0) {
    return [{}, [new Error(`no unit ${UNIT} ${url}`)]]
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
    const doi = isDoiUrl(doiurl) ? urlToDoi(doiurl) : ""

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
 * @return {[{ title: string, abstract: string | null }, number ]}
 */
const crawlDoi = async (paperid) => {
  const endp = `https://api.semanticscholar.org/graph/v1/paper/${paperid}?fields=title,abstract`
  try {
    const res = await fetch(endp, { headers, signal: AbortSignal.timeout(20_000) })
    if (!res.ok) {
      return [{}, res.status]
    }
    if (res.status === 200) {
      stat.semantic200Cnt += 1
    }
    const json = await res.json()
    return [{
      title: json.title,
      abstract: json.abstract,
    }, res.status]
  } catch(e) {
    return [null, 408]
  }
};

/**
 * 
 * @param {string} title 
 * @return {[string | null, number ]} [semanticScholarId, statusCode]
 */
const crawlIdByTitle = async (title) => {
  const endp = `https://api.semanticscholar.org/graph/v1/paper/search?query=${title}&limit=1`
  try {
    const res = await fetch(endp, { headers, signal: AbortSignal.timeout(20_000) })
    if (!res.ok) {
      return [null, res.status]
    }
    if (res.status === 200) {
      stat.semantic200Cnt += 1
    }
    const json = await res.json()
    if (json.total === 0) {
      return [null, res.status]
    }

    return [json.data[0].paperId, res.status]
  } catch(e) {
    return [null, 408]
  }
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
 * @returns {void}
 */
const save = (year, venue, title, abstract) => {
  // const fs = {
  //   mkdir: console.log,
  //   writeFile: console.log,
  // }
  // const fs = {
  //   mkdir: nop,
  //   writeFile: nop,
  // }
  if (abstract === "") {
    stat.noAbstractCnt += 1
  }
  try {
    const filepath = toFilePath(year, venue, title)
    fsSync.mkdirSync(`data/${year}/${venue}`, { recursive: true })
    if (!exists(filepath) || (isEmpty(filepath) && abstract !== "")) {
      fsSync.writeFileSync(filepath, abstract)
      stat.saved += 1
    } else {
      stat.notSaved += 1
      stat.failed.push({ title, doi: "", error: "no abstract found"})
    }
  } catch (e) {
    console.log(new Error(`${title} ${abstract}`))
    stat.notSaved += 1
    stat.failed.push({ title, doi: "unknown", error: e.toString()})
  }

}

/**
 * sleep msec
 * @param {msec} msec
 * @returns 
 */
const sleep = async (msec) => await new Promise(resolve => setTimeout(resolve, msec));
const stat = {
  noAbstractCnt: 0,
  titleMismtachCnt: 0,
  currentVenue: "",
  semantic200Cnt: 0,
  reqCnt: 0,
  failed: [],
  saved: 0,
  notSaved: 0,
};

(async () => {
  const yearFlag = process.argv[2] || "2018-2023"
  const seek = +process.argv[3] || 9999
  // let dblpQ = dblp.map(e => e)
  let dblpQ = require(`./venues/${yearFlag}`).map(e => e)
  // console.log(dblpQ.pop())
  let semanticsScolarQ = []
  const start = process.hrtime();

  const elapsed = () => +process.hrtime(start)[0]

  const printStat = () => {
    const perSec = (metric) => (metric / elapsed()).toFixed(3)
    console.log(`${stat.currentVenue} dblpQ.len ${dblpQ.length} scholarQ.len ${semanticsScolarQ.length} Ok ${perSec(stat.semantic200Cnt)}/s saved ${stat.saved} (${perSec(stat.saved)}/s) notSaved ${stat.notSaved} (${perSec(stat.notSaved)}/s) stat.failed ${stat.failed.length} requeue ${stat.reqCnt} (${perSec(stat.reqCnt)}/s) titleMismtachCnt ${stat.titleMismtachCnt} (${perSec(stat.titleMismtachCnt)}/s) noabs ${stat.noAbstractCnt} (${perSec(stat.noAbstractCnt)})`)
  }
  
  while (seek < dblpQ.length) {
    dblpQ.pop()
  }

  const runDblp = async () => {
    // Skip if semantics scholar q is large.
    if (20 < semanticsScolarQ.length) {
      return
    }
    // confernce := <- dblpQ
    if (dblpQ.length === 0) { return; }
    const conference = dblpQ.pop()
    console.log(conference)
    stat.currentVenue = `${conference.year}/${conference.name}`

    const [papers, errs] = await crawlDblp(conference.url)
    if (0 < errs.length) {
      console.error(`${errs.length} errors in ${conference.url}. Pick 3:`)
      console.error(pick(3, errs))
    }

    if (papers.filter === undefined) {
      stat.failed.push(`${conference.url} not found`)
      return
    }

    papers
    .filter(({ title, doi }) => {
      const filepath = toFilePath(conference.year, conference.name, title)
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
      const [id, statusCode] = await crawlIdByTitle(title)
      switch (statusCode) {
      case 200:
        if (id === null) {
          // we can't get abstract
          save(year, name, title, "")
          return
        } else {
          stat.reqCnt += 1
          // give a priority
          semanticsScolarQ = [
            ...semanticsScolarQ,
            { year, name, title, doi: id },
          ]
          return;
        }
      case 429:
        // too many requets. requeue w/ priority
        stat.reqCnt += 1
        semanticsScolarQ = [
          ...semanticsScolarQ,
          { year, name, title, doi: null },
        ]
        return
      default:
        stat.failed.push({title, doi, error: `crawlIdByTitle returned ${statusCode}`})
      }
      return
    }

    const [paper, statusCode] = await crawlDoi(doi)
    switch (statusCode) {
    case 200:
      if ((!paper.abstract || 10 < levenshtein(paper.title, title)) && isDoi(doi)) {
        /* semantic scholar found paper by DOI, however, suspect that the
        content might be wrong for some reasons. Retry with a title */
        stat.reqCnt += 1
        semanticsScolarQ = [
          ...semanticsScolarQ,
          { year, name, title, doi: null },
        ]
        return  
      }
      break;
    case 404:
      // cannot find paper by DOI. Try semantic scholar ID
      stat.reqCnt += 1
      semanticsScolarQ = [
        ...semanticsScolarQ,
        { year, name, title, doi: null },
      ]
      return

    // Too frequent requests. Just requeue.
    case 429:
      stat.reqCnt += 1
      semanticsScolarQ = [
        ...semanticsScolarQ,
        { year, name, title, doi },
      ]
      return

    default:
      stat.failed.push({ title, doi, error: `crawlDoi returned ${statusCode}`})
      return
    }
    
    if (title !== paper.title) {
      stat.titleMismtachCnt += 1
      const filepath = toFilePath(year, name, paper.title)
      if (exists(filepath)) {
        const newFilePath = toFilePath(year, name, title)
        fsSync.renameSync(filepath, newFilePath)
      }
    }
    save(year, name, title, paper.abstract || "")
  }

  const dblpWorker = setInterval(runDblp, 3000);
  const semanticScholarWorker = setInterval(runSemanticScholar, 1100);

  while (true) {
    await sleep(3000)

    printStat()
    fsSync.writeFileSync("./data_crawler/failed.json", JSON.stringify(stat.failed, null, 2))
    if (dblpQ.length === 0) {
      // 10 sec room
      await sleep(10_000)
      if (semanticsScolarQ.length === 0 && dblpQ.length === 0) {
        // all queues are empty
        clearInterval(dblpWorker)
        clearInterval(semanticScholarWorker)
        console.log(JSON.stringify(stat.failed, null, 2))
        process.exit(0)
      }
    }
  }
})();