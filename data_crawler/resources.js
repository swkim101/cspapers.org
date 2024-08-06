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

const usenix = [
  // ...seq(18, 21).map(y => ({
  //   year: `20${y}`,
  //   venue: "usenix",
  //   url: `https://www.usenix.org/conference/usenixsecurity${y}/technical-sessions`,
  //   unitQs: "article.node-paper",
  //   titleQs: "h2",
  //   absQs: ["div.content > div > div.group-schedule-accordion"],
  // }),
  ...seq(18, 25).map(y => ({
    year: `20${y}`,
    venue: "usenix",
    url: `https://www.usenix.org/conference/usenixsecurity${y}/technical-sessions`,
    unitQs: "article.node-paper",
    titleQs: "h2",
    absQs: ["div.content > div > div.group-schedule-accordion"],
  }))
]

module.exports = [
  // ...ndss
  ...usenix
]