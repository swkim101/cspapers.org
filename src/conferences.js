import { buildTree } from "./functional"

/* add new conferences here */
const edges = [
  ["All Areas", "AI"],

  ["AI", "Natural language processing"],
  ["Natural language processing", "ACL"],

  ["AI", "The Web & information retrieval"],
  ["The Web & information retrieval", "WWW"],

  ["All Areas", "Systems"],

  ["Systems", "Computer security"],
  ["Computer security", "NDSS"],
  ["Computer security", "Usenix"],
  ["Computer security", "SP"],
  ["Computer security", "CCS"],

  ["Systems", "Operating systems"],
  ["Operating systems", "OSDI"],
  ["Operating systems", "SOSP"],
  ["Operating systems", "ATC"],
  ["Operating systems", "ASPLOS"],
  ["Operating systems", "EuroSYS"],

  ["Systems", "Software engineering"],
  ["Software engineering", "FSE"],
  ["Software engineering", "ICSE"],
  ["Software engineering", "ASE"],
  ["Software engineering", "ISSTA"],

  ["Systems", "Programming languages"],
  ["Programming languages", "PLDI"],
  
]

/**
 * Return leaves's names.
 * @typedef {{ name: string, children: [Tree] }} Tree
 * @param {Tree} tree
 * @returns {string}
 */
const flatten = (tree) =>
  tree.children.reduce((acc, cur) =>
    cur.children ? [...acc, ...flatten(cur)] : [...acc, cur.name]
    , [])

const conferences = {
  tree: buildTree(edges, "All Areas"),
  flatten,
}

export default conferences