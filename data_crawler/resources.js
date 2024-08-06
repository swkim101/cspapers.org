const seq = (start, end, step = 1) => Array.from({ length: end - start }, (_, i) => start + i * step)
const notN = (n, i) => n !== i
const not2020 = i => notN(2020, i)

// Data Locator = Locator Int   String String String  String   [String]
//                        ^year ^url   ^venue ^unitQS ^titleQS ^absQS and (Spares)
const ndss = [
  {
    year: 2018,
    venue: "ndss",
    url: `https://www.ndss-symposium.org/ndss-program-2018-program/`,
    unitQs: "div.row > div.col-lg-8",
    titleQs: "p > b",
    absQs: ["div.modal-body"],
  },
  {
    year: 2019,
    venue: "ndss",
    url: `https://www.ndss-symposium.org/ndss-program/ndss-symposium-2019-program/`,
    unitQs: "ul.list-group-session > li",
    titleQs: "div.row > div.col-10 > div > strong",
    absQs: ["div.row > div.col-12"],
  },
  {
    year: 2020,
    venue: "ndss",
    url: `https://www.ndss-symposium.org/ndss-program/2020-program/`,
    unitQs: "ul.list-group-session > li",
    titleQs: "div.row > div.col-10 > div > strong",
    absQs: ["div.row > div.col-12"],
  },
  ...seq(2021, 2023).map(y => ({
  year: y,
  venue: "ndss",
  url: `https://www.ndss-symposium.org/ndss-program/ndss-${y}/`,
  unitQs: "ul.list-group-session > li",
  titleQs: "div.row > div.col-10 > div > strong",
  absQs: ["div.row > div.col-12"],
  })),
  {
    year: 2023,
    venue: "ndss",
    url: `https://www.ndss-symposium.org/ndss-program/symposium-2023/`,
    unitQs: "ul.list-group-session > li",
    titleQs: "div.row > div.col-10 > div > strong",
    absQs: ["div.row > div.col-12"],
  }
]

/* I love this consistency of Usenix */
const usenix = [
  ...seq(18, 25).map(y => ({
    year: `20${y}`,
    venue: "usenix",
    url: `https://www.usenix.org/conference/usenixsecurity${y}/technical-sessions`,
    unitQs: "article.node-paper",
    titleQs: "h2",
    absQs: ["div.content > div > div.group-schedule-accordion"],
  }))
]

const osdi = [
  ...seq(18, 25).map(y => ({
    year: `20${y}`,
    venue: "osdi",
    url: `https://www.usenix.org/conference/osdi${y}/technical-sessions`,
    unitQs: "article.node-paper",
    titleQs: "h2",
    absQs: ["div.content > div > div.group-schedule-accordion"],
  }))
]

const atc = [
  ...seq(18, 25).map(y => ({
    year: `20${y}`,
    venue: "atc",
    url: `https://www.usenix.org/conference/atc${y}/technical-sessions`,
    unitQs: "article.node-paper",
    titleQs: "h2",
    absQs: ["div.content > div > div.group-schedule-accordion"],
  }))
]

const ccs = [
  {
    year: 2018,
    venue: "ccs",
    url: `https://www.sigsac.org/ccs/CCS2018/accepted/papers/`,
    unitQs: "article.status-publish > div > table > tbody > tr",
    titleQs: "td",
    // no abs found
    absQs: [],
  },
  {
    year: 2019,
    venue: "ccs",
    url: `https://sigsac.org/ccs/CCS2019/index.php/program/accepted-papers/`,
    unitQs: "article.status-publish > div > table > tbody > tr",
    titleQs: "td",
    // no abs found
    absQs: [],
  },
  {
    year: 2020,
    venue: "ccs",
    url: `https://www.sigsac.org/ccs/CCS2020/accepted-papers.html`,
    unitQs: "div.papers-item",
    titleQs: "div > b",
    // no abs found
    absQs: [],
  },
  ...seq(2022, 2023).map(y => ({
    year: y,
    venue: "ccs",
    url: `https://www.sigsac.org/ccs/CCS${y}/program/accepted-papers.html`,
    unitQs: "tr",
    titleQs: "td",
    // no abs found
    absQs: [],
  })),
  {
    year: 2023,
    venue: "ccs",
    // ccs2023 rendering requires js. fetch() cannot do this.
    url: `./data_crawler/raw/ACM CCS 2023.htm`,
    unitQs: "div#acceptPaper > div",
    titleQs: "div > h4",
    // no abs found
    absQs: [],
  }
]

const sosp = [
  {
    year: 2019,
    venue: "sosp",
    url: `https://sosp19.rcs.uwaterloo.ca/program.html`,
    unitQs: "table > tbody > tr > td",
    titleQs: "strong > a",
    // no abs found
    absQs: [],
  },
  {
    year: 2021,
    venue: "sosp",
    url: `https://sosp2021.mpi-sws.org/program.html`,
    unitQs: "table > tbody > tr > td",
    titleQs: "strong > a",
    // no abs found
    absQs: [],
  },
  {
    year: 2023,
    venue: "sosp",
    url: `https://sosp2023.mpi-sws.org/accepted.html`,
    unitQs: "div.welcome > div",
    titleQs: "p > b",
    // no abs found
    absQs: [],
  }
]

const sp = [
  ...seq(2018, 2023).map(y => ({
    year: y,
    venue: "sp",
    url: `https://www.ieee-security.org/TC/SP${y}/program.html`,
    unitQs: "div > div.list-group-item",
    titleQs: "b",
    // no abs provided
    absQs: [],
  })),
  ...seq(2023, 2025).map(y => ({
    year: y,
    venue: "sp",
    url: `https://sp${y}.ieee-security.org/program.html`,
    unitQs: "div > div.list-group-item",
    titleQs: "b",
    // no abs provided
    absQs: [],
  }))
]


const acl = [
  {
    year: 2024,
    venue: "acl",
    url: `https://2024.aclweb.org/program/main_conference_papers`,
    unitQs: "section.page__content > ul > li",
    titleQs: "strong",
    // no abs found
    absQs: [],
  }
]

module.exports = [
  ...acl
]