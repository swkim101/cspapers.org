const resourse = require('./resources');
const fs = require('fs/promises')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const pick = (n = 0, arr = []) => arr.filter((_, i) => i < n)
const nop = () => {}

const defaultLoc = {
  year: 0,
  venue: "",
  url: "",
  unitQs: "",
  titleQs: "",
  absQs: [""],
}

const getHtml = async (url = "") => {
  if (url.startsWith("http")) {
    return getHtmlFetch(url)
  } else if (url.startsWith("./")) {
    return getFileFetch(url)
  } else {
    return ["", new Error("undefined url type ", url)]
  }
}

const getHtmlFetch = async (url = "") => {
  const res = await fetch(url)
  if (!res.ok) {
    return ["", new Error(`${res.statusText} ${url}`)]
  }
  const html = await res.text()
  return [html, null]
}

const getFileFetch = async (url = "") => {
  try {
    const html = await fs.readFile(url, { encoding: "utf-8" })
    return [html, null]
  } catch (err) {
    return ["", new Error(`${err}`)]
  }
}

// Data Paper = Paper title abstract
// crawl :: Locator -> ([Paper] -> [error])
const crawl = async (loc = defaultLoc) => {
  const [html, err] = await getHtml(loc.url)
  if (err !== null) {
    return [[], [err]]
  }
  const document = (new JSDOM(html)).window.document
  const units = document.querySelectorAll(loc.unitQs)
  if (units.length === 0) {
    return [[], [new Error(`no unit ${loc.unitQs} ${loc.url}`)]]
  }

  let papers = []
  let errors = []
  for (let unit of units) {
    const title = unit.querySelector(loc.titleQs)?.textContent?.trim()
    if (!title) { 
      errors = [...errors, new Error(`cannot find title for ${loc.url} ${loc.titleQs}`)]
      continue
    }
    const abstract = loc.absQs.reduce((acc, cur) =>
      acc === null ?
      unit.querySelector(cur)?.textContent?.trim() :
      acc
    , null)
    if (!abstract && 0 < loc.absQs.length) {
      errors = [...errors, new Error(`no abstract for ${loc.url} ${title} ${loc.absQs}`)]
    }
    papers = [
      ...papers,
    {
      title,
      abstract: abstract || ""
    }]
  }
  return [papers, errors]
};

// crawl :: year -> venue -> title -> abstract -> error
const save = async (year = 0, venue = "", title = "", abstract = "") => {
  // const fs = {
  //   mkdir: console.log,
  //   writeFile: console.log,
  // }
  // const fs = {
  //   mkdir: nop,
  //   writeFile: nop,
  // }
  const newTitle = title.replaceAll("/", " ")
  let err = await fs.mkdir(`data/${year}/${venue}`, { recursive: true })
  if (err !== undefined) { return err }
  err = await fs.writeFile(`data/${year}/${venue}/${newTitle}`, abstract)
  if (err !== undefined) { return err }
  
  return null
}

(async () => {
resourse.map(async (r) => {
  const [papers, errs] = await crawl(r)
  // 
  if (0 < errs.length) {
    console.log(`${errs.length} errors in crawling ${r.url}`)
    console.log("show some: ")
    pick(3, errs).map(e => console.log(e))
  }
  papers.map(async (p) => {
    const err = await save(r.year, r.venue, p.title, p.abstract)
    if (err) {
      console.log(`failed to save ${p.title} ${err}`)
    }
  })
})
})();