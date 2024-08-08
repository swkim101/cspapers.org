const resourse = require('./resources');
const fs = require('fs/promises')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const pick = (n = 0, arr = []) => arr.filter((_, i) => i < n)
const nop = () => {}

/**
 * @typedef {{
 *  year: number,
 *  venue: string,
 *  url: string,
 *  unitQs: string, // query string encompassing both title and abstract
 *  titleQs: string,
 *  absQs: [string],
 * }} ConferenceInfo
 * 
 * @typedef {{
 *   title: string,
 *   year:  number,
 *   venue: string,
 * }} Paper
 */

/**
 * Get HTML from an http server or local directory
 * @param {string} url 
 * @returns {Promise<[string, Error | null ]>} HTML string
 */
const getHtml = async (url) => {
  if (url.startsWith("http")) {
    return getHtmlFetch(url)
  } else if (url.startsWith("./")) {
    return getFileFetch(url)
  } else {
    return ["", new Error("undefined url type ", url)]
  }
}

/**
 * @param {string} url 
 * @returns {Promise<[string, Error | null ]>} HTML string
 */
const getHtmlFetch = async (url = "") => {
  const res = await fetch(url)
  if (!res.ok) {
    return ["", new Error(`${res.statusText} ${url}`)]
  }
  const html = await res.text()
  return [html, null]
}

/**
 * @param {string} url 
 * @returns {Promise<[string, Error | null ]>} HTML string
 */
const getFileFetch = async (url = "") => {
  try {
    const html = await fs.readFile(url, { encoding: "utf-8" })
    return [html, null]
  } catch (err) {
    return ["", new Error(`${err}`)]
  }
}

/**
 * Get papers from conference information
 * @param {ConferenceInfo} conference 
 * @returns {Promise<[[Paper], [Error]]>}
 */
const crawl = async (conference) => {
  const [html, err] = await getHtml(conference.url)
  if (err !== null) {
    return [[], [err]]
  }
  const document = (new JSDOM(html)).window.document
  const units = document.querySelectorAll(conference.unitQs)
  if (units.length === 0) {
    return [[], [new Error(`no unit ${conference.unitQs} ${conference.url}`)]]
  }

  let papers = []
  let errors = []
  for (let unit of units) {
    const title = unit.querySelector(conference.titleQs)?.textContent?.trim()
    if (!title) { 
      errors = [...errors, new Error(`cannot find title for ${conference.url} ${conference.titleQs}`)]
      continue
    }
    const abstract = conference.absQs.reduce((acc, cur) =>
      acc || unit.querySelector(cur)?.textContent?.trim()
    , null)
    if (!abstract && 0 < conference.absQs.length) {
      errors = [...errors, new Error(`no abstract for ${conference.url} ${title} ${conference.absQs}`)]
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

/**
 * 
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