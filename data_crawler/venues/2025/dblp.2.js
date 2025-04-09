const prefix = 'https://dblp.org/db'
const names = [
  ["usenix", (year) => `${prefix}/conf/uss/uss${year}.html`], // usenix security
  ["atc", (year) => `${prefix}/conf/usenix/usenix${year}.html`],
  ["fse", (year) => `${prefix}/conf/sigsoft/fse${year}.html`],
  ["ase", (year) => `${prefix}/conf/kbse/ase${year}.html`],
  ["ec", (year) => `${prefix}/conf/sigecom/sigecom${year}.html`],
  ["neurips", (year) => `${prefix}/conf/nips/neurips${year}.html`],
  ["ubicomp", (year) => `${prefix}/conf/huc/ubicomp${year}.html`],
  ["acl", (year) => `${prefix}/conf/acl/acl${year}-1.html`],
  ["vldb", (year) => `${prefix}/journals/pvldb/pvldb${year-2006}.html`],
  ["pacmpl", (year) => `${prefix}/journals/pacmpl/pacmpl${year-2016}.html`],
  ["pacmmod", (year) => `${prefix}/journals/pacmpl/pacmpl${year-2022}.html`],
]

const venues = names.map(([name, fn]) => ({
  name,
  year: 2025,
  crawler: "dblp-common",
  url: fn(2025),
}))

module.exports = venues