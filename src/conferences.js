import { buildTree } from "./functional"

/* add new conferences here */
const edges = [
  ["All Areas", "AI"],

  ["AI", "Natural language processing"],
  ["Natural language processing", "ACL"],

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
]

// Return leaves only
// flatten :: Tree -> [string]
const flatten = (tree) =>
  tree.children.reduce((acc, cur) =>
    cur.children ? [...acc, ...flatten(cur)] : [...acc, cur.name]
    , [])

const conferences = {
  tree: buildTree(edges, "All Areas"),
  flatten,
}

export default conferences