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
  ["conf/iclr/iclr", "iclr"],
  ["conf/icml/icml", "icml"],
  ["conf/aaai/aaai", "aaai"],
  ["conf/ijcai/ijcai", "ijcai"],
  ["conf/sigir/sigir", "sigir"],
  // ["conf/cvpr/cvpr", "cvpr"],

  ["conf/chi/chi", "chi"],
  ["conf/uist/uist", "uist"],
  ["conf/sigecom/sigecom", "ec"],
  ["conf/wine/wine", "wine"],
  ["conf/rss/rss", "rss"],
  ["conf/icra/icra", "icra"],
  ["conf/iros/iros", "iros"],
  ["conf/sp/sp", "sp"],
  ["conf/ndss/ndss", "ndss"],
  ["conf/ccs/ccs", "ccs"],
  ["conf/uss/uss", "usenix"], // usenix security
  ["conf/usenix/usenix", "atc"],
  ["conf/sigsoft/fse", "fse"],
  ["conf/kbse/ase", "ase"],
  ["conf/icse/icse", "icse"],
  ["conf/issta/issta", "issta"],
  ["conf/eurosys/eurosys", "eurosys"],
  ["conf/www/www", "www"],
  ["conf/mobisys/mobisys", "mobisys"],
  ["conf/mobicom/mobicom", "mobicom"],
  ["conf/sensys/sensys", "sensys"],
  ["conf/focs/focs", "focs"],
  ["conf/soda/soda", "soda"],
  ["conf/stoc/stoc", "stoc"],
  ["conf/lics/lics", "lics"],
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
  ...seq(2020, 2024)
  .map(year => ({
    name: "neurips",
    year,
    url: `https://dblp.org/db/conf/nips/neurips${year}.html`
  })),
  ...seq(2018, 2020)
  .map(year => ({
    name: "neurips",
    year,
    url: `https://dblp.org/db/conf/nips/nips${year}.html`
  })),
  ...seq(12, 18)
  .map(vol => ({
    name: "vldb",
    year: vol + 2006,
    url: `https://dblp.org/db/journals/pvldb/pvldb${vol}.html`
  })),
  ...seq(2018, 2023)
  .map(year => ({
    name: "sigmod",
    year,
    url: `https://dblp.org/db/conf/sigmod/sigmod${year}.html`
  })),
  ...seq(2018, 2020)
  .filter(year => notN(2020, year) && notN(2023, year))
  .map(year => ({
    name: "naacl",
    year,
    url: `https://dblp.org/db/conf/naacl/naacl${year}-1.html`
  })),
  ...seq(2020, 2024)
  .filter(year => notN(2020, year) && notN(2023, year))
  .map(year => ({
    name: "naacl",
    year,
    url: `https://dblp.org/db/conf/naacl/naacl${year}.html`
  })),
  {
    name: "acl",
    year: 2020,
    url: `https://dblp.org/db/conf/acl/acl2020.html`
  },
  ...seq(2018, 2024)
  .filter(year => notN(2020, year))
  .map(year => ({
    name: "acl",
    year,
    url: `https://dblp.org/db/conf/acl/acl${year}-1.html`
  })),
  ...seq(2018, 2024).map(year => ({
    name: "ubicomp",
    year,
    url: `https://dblp.org/db/conf/huc/ubicomp${year}ap.html`
  })),
  ...seq(1, 6).map(vol =>({
    name: "crypto",
    year: 2023,
    url: `https://dblp.org/db/conf/crypto/crypto2023-${vol}.html`
  })),
  ...seq(2021, 2023).map(year => 
    seq(1, 5).map(vol =>({
      name: "crypto",
      year,
      url: `https://dblp.org/db/conf/crypto/crypto${year}-${vol}.html`
    })
  )).flat(),
  ...seq(2018, 2021).map(year => 
    seq(1, 4).map(vol =>({
      name: "crypto",
      year,
      url: `https://dblp.org/db/conf/crypto/crypto${year}-${vol}.html`
    })
  )).flat(),
  ...seq(1, 8).map(vol =>({
    name: "eurocrypt",
    year: 2024,
    url: `https://dblp.org/db/conf/eurocrypt/eurocrypt2024-${vol}.html`
  })),
  ...seq(1, 6).map(vol =>({
    name: "eurocrypt",
    year: 2023,
    url: `https://dblp.org/db/conf/eurocrypt/eurocrypt2023-${vol}.html`
  })),
  ...seq(2018, 2023).map(year => 
    seq(1, 4).map(vol =>({
      name: "eurocrypt",
      year,
      url: `https://dblp.org/db/conf/eurocrypt/eurocrypt${year}-${vol}.html`
    })
  )).flat(),
  ...seq(1, 5).map(vol => ({
    name: "asplos",
    year: 2023,
    url: `https://dblp.org/db/conf/asplos/asplos2023-${vol}.html`
  })),
  ...seq(2018, 2023).map(year => ({
    name: "asplos",
    year,
    url: `https://dblp.org/db/conf/asplos/asplos${year}.html`
  })),
  {
    name: "osdi",
    year: 2018,
    url: `https://dblp.org/db/conf/osdi/osdi2018.html`
  },
  // osdi 2019 does not exist
  ...seq(2020, 2024).map(year => ({
    name: "osdi",
    year,
    url: `https://dblp.org/db/conf/osdi/osdi${year}.html`
  })),
  ...seq(2017, 2024, 2).map(year => ({
    name: "sosp",
    year,
    url: `https://dblp.org/db/conf/sosp/sosp${year}.html`
  })),
  ...seq(2018, 2023).map(year => ({
    name: "pldi",
    year,
    url: `https://dblp.org/db/conf/pldi/pldi${year}.html`
  })),
  ...seq(2018, 2024)
  .filter(year => ![2019, 2020, 2021].includes(year))
  .map(year => ({
    name: "emnlp",
    year,
    url: `https://dblp.org/db/conf/emnlp/emnlp${year}.html`
  })),
  ...seq(2019, 2022)
  .map(year => ({
    name: "emnlp",
    year,
    url: `https://dblp.org/db/conf/emnlp/emnlp${year}-1.html`
  })),
  ...seq(2, 8).map(vol => ({
    name: "pacmpl",
    year: vol+2016,
    url: `https://dblp.org/db/journals/pacmpl/pacmpl${vol}.html`,
  })),
]

module.exports = [
  ...regulars,
  ...irregulars,
]