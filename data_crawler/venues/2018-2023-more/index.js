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
  ["conf/kdd/kdd", "kdd"],
  ["conf/cikm/cikm", "cikm"],
  ["conf/icdm/icdm", "icdm"],
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
  ...seq(2019, 2024, 2).map(year => ({
    name: "iccv",
    year,
    url: `https://dblp.org/db/conf/iccv/iccv${year}.html`
  })),
  ...seq(1, 17).map(n => (
  {
    name: "eccv",
    year: 2018,
    url: `https://dblp.org/db/conf/eccv/eccv2018-${n}.html`
  })),
  ...seq(1, 31).map(n => (
  {
    name: "eccv",
    year: 2020,
    url: `https://dblp.org/db/conf/eccv/eccv2020-${n}.html`
  })),
  ...seq(1, 40).map(n => (
  {
    name: "eccv",
    year: 2022,
    url: `https://dblp.org/db/conf/eccv/eccv2022-${n}.html`
  })),
]

module.exports = [
  ...regulars,
  ...irregulars,
]