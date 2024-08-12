import { buildTree } from "./functional"

/* add new conferences here */
const edges = [
  ["All Areas", "AI"],

  ["AI", "Artificial intelligence"],
  ["Artificial intelligence", "AAAI"],
  ["Artificial intelligence", "IJCAI"],

  ["AI", "Computer vision"],
  ["Computer vision", "CVPR"],

  ["AI", "Machine learning"],
  ["Machine learning", "ICLR"],
  ["Machine learning", "ICML"],
  ["Machine learning", "NeurIPS"],

  ["AI", "Natural language processing"],
  ["Natural language processing", "ACL"],
  ["Natural language processing", "EMNLP"],
  ["Natural language processing", "NAACL"],

  ["AI", "The Web & information retrieval"],
  ["The Web & information retrieval", "SIGIR"],
  ["The Web & information retrieval", "WWW"],

  ["All Areas", "Systems"],

  ["Systems", "Computer architecture"],
  ["Computer architecture", "ASPLOS"],

  ["Systems", "Computer security"],
  ["Computer security", "NDSS"],
  ["Computer security", "Usenix"],
  ["Computer security", "SP"],
  ["Computer security", "CCS"],

  ["Systems", "Databases"],
  ["Databases", "SIGMOD"],
  ["Databases", "VLDB"],

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
  ["Programming languages", "PACMPL"],
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

const comments = {
  "PLDI": "(2018 - 2022)",
  "SOSP": "(2017 - 2023), biyearly",
}

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

export {
  conferences,
  comments
}