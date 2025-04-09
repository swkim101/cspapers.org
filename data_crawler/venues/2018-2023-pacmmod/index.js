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
 * @type {[ Venue ]}
 */
const irregulars = [
  ...[1, 2, 3].map(vol => ({
    name: "pacmmod",
    year: vol+2022,
    url: `https://dblp.org/db/journals/pacmmod/pacmmod${vol}.html`
  })),
]

module.exports = [
  ...irregulars,
]