/**
 * return [start, end)
 * @param {number} start 
 * @param {number} end 
 * @param {number} step 
 * @returns { [number] }
 */
const seq = (start, end, step = 1) => Array.from({ length: Math.floor((end - start)/step) }, (_, i) => start + i * step)

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
  ["conf/sp/sp", "sp"],
  ["conf/ndss/ndss", "ndss"],
  ["conf/ccs/ccs", "ccs"],
  ["conf/uss/uss", "usenix"], // usenix security
  ["conf/usenix/usenix", "atc"],
  ["conf/asplos/asplos", "asplos"],
  ["conf/sigsoft/fse", "fse"],
  ["conf/osdi/osdi", "osdi"],
  ["conf/kbse/ase", "ase"],
  ["conf/icse/icse", "icse"],
  ["conf/issta/issta", "issta"],
  ["conf/eurosys/eurosys", "eurosys"],
  ["conf/www/www", "www"]
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
  seq(2017, 2024, 2).map(year => ({
    name: "sosp",
    year,
    url: `https://dblp.org/db/conf/sosp/sosp${year}.html`
  })),
  seq(2018, 2023).map(year => ({
    name: "pldi",
    year,
    url: `https://dblp.org/db/conf/pldi/pldi${year}.html`
  })),
  // todo: separate this in popl, pldi, oopsla, ...
  // seq(1, 9).map(volume => ({
  //   year: volume + 2015,
  //   url: `https://dblp.org/journals/pacmpl/pacmpl${volume}.html.html`
  // }))
].flat()

module.exports = [
  ...regulars,
  ...irregulars,
]