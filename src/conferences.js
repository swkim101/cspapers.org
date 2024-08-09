import { buildTree } from "./functional"

/* add new conferences here */
const edges = [
  ["All Areas", "AI"],

  ["AI", "Natural language processing"],
  ["Natural language processing", "ACL"],

  ["AI", "The Web & information retrieval"],
  ["The Web & information retrieval", "WWW"],

  ["All Areas", "Systems"],

  ["Systems", "Computer architecture"],
  ["Computer architecture", "ASPLOS"],

  ["Systems", "Computer security"],
  ["Computer security", "NDSS"],
  ["Computer security", "Usenix"],
  ["Computer security", "SP"],
  ["Computer security", "CCS"],

  ["Systems", "Mobile computing"],
  ["Mobile computing", "MobiCom"],
  ["Mobile computing", "MobiSys"],
  ["Mobile computing", "SenSys"],

  ["Systems", "Operating systems"],
  ["Operating systems", "OSDI"],
  ["Operating systems", "SOSP"],
  ["Operating systems", "ATC"],
  ["Operating systems", "EuroSYS"],

  ["Systems", "Software engineering"],
  ["Software engineering", "FSE"],
  ["Software engineering", "ICSE"],
  ["Software engineering", "ASE"],
  ["Software engineering", "ISSTA"],

  ["Systems", "Programming languages"],
  ["Programming languages", "PLDI"],

  ["All Areas", "Theory"],

  ["Theory", "Algorithms & complexity"],
  ["Algorithms & complexity", "FOCS"],
  ["Algorithms & complexity", "SODA"],
  ["Algorithms & complexity", "STOC"],

  ["Theory", "Cryptography"],
  ["Cryptography", "CRYPTO"],
  ["Cryptography", "EuroCrypt"],

  ["Theory", "Logic & verification"],
  ["Logic & verification", "LICS"],

  ["All Areas", "Interdisciplinary Areas"],

  ["Interdisciplinary Areas", "Economics & computation"],
  ["Economics & computation", "EC"],
  ["Economics & computation", "WINE"],
  
  ["Interdisciplinary Areas", "Human-computer interaction"],
  ["Human-computer interaction", "CHI"],
  ["Human-computer interaction", "UbiComp"],
  ["Human-computer interaction", "UIST"],

  ["Interdisciplinary Areas", "Robotics"],
  ["Robotics", "ICRA"],
  ["Robotics", "IROS"],
  ["Robotics", "RSS"],
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