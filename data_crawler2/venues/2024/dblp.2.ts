const prefix = 'https://dblp.org/db'
const names: [string, (_: number) => string][] = [
  ["usenix", (year: number) => `${prefix}/conf/uss/uss${year}.html`], // usenix security
  ["atc", (year: number) => `${prefix}/conf/usenix/usenix${year}.html`],
  ["fse", (year: number) => `${prefix}/conf/sigsoft/fse${year}.html`],
  ["ase", (year: number) => `${prefix}/conf/kbse/ase${year}.html`],
  ["ec", (year: number) => `${prefix}/conf/sigecom/sigecom${year}.html`],
  ["neurips", (year: number) => `${prefix}/conf/nips/neurips${year}.html`],
  ["ubicomp", (year: number) => `${prefix}/conf/huc/ubicomp${year}.html`],
  ["acl", (year: number) => `${prefix}/conf/acl/acl${year}-1.html`],
  ["vldb", (year: number) => `${prefix}/journals/pvldb/pvldb${year-2006}.html`]
]

const venues: Venue[] = names.map(([name, fn]) => ({
  name,
  year: 2024,
  crawler: "dblp-common",
  urls: [fn(2024)]
}))

export default venues