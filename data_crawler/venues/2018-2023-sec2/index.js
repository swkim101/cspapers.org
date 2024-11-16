/**
 * return [start, end)
 * @param {number} start 
 * @param {number} end 
 * @param {number} step 
 * @returns { [number] }
 */
const seq = (start, end, step = 1) => Array.from({ length: Math.floor((end - start)/step) }, (_, i) => start + i * step)
const notN = (n, i) => n !== i

/**
 * @typedef {
 *  name: string,
 *  url: string, // dblp url
 *  year: number
 * } Venue
 */

/**
 * @type {[ [string, string ]]} - dblp url, conference name
 */
const regularUrls = [
  ["conf/acsac/acsac", "acsac"],
  ["conf/eurosp/eurosp", "eurosp"],
  ["conf/asiaccs/asiaccs", "asiaccs"],
]

/**
 * @type {[ Venue ]}
 */
const regulars = regularUrls.map(([url, name]) =>
  seq(2018, 2024).map(year => ({
    name,
    year,
    url: `https://dblp.org/db/${url}${year}.html`
  }))
).flat()


/**
 * @type {[ Venue ]}
 */
const irregulars = [
  ...seq(2018, 2021).map(year => ({
    name: "asiaccs",
    year,
    url: `https://dblp.org/db/conf/ccs/asiaccs${year}.html`
  }))
]

module.exports = [
  ...regulars,
  ...irregulars,
]