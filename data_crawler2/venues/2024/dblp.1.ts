const prefix = 'https://dblp.org/db/conf'
const names = [
  "iclr",
  "icml",
  "aaai",
  "ijcai",
  "sigir",
  "cvpr",
  "naacl",
  "sigmod",
  "emnlp",
  "chi",
  "uist",
  "wine",
  "rss",
  "icra",
  "iros",
  "icse",
  "issta",
  "eurosys",
  "www",
  "mobisys",
  "mobicom",
  "sensys",
  "focs",
  "soda",
  "stoc",
  "lics",
  "osdi",
  "sp",
  "ndss",
  "ccs",
]


const venues: Venue[] = names.map(([name, urlFunc]) => ({
    name,
    year: 2024,
    crawler: "dblp-common",
    urls: [`${prefix}/${name}/${name}2024.html`]
  })
)

export default venues