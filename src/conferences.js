/* add new conferences here */
const edges = [
  ["All Areas", "AI"],
  ["All Areas", "Systems"],
  ["AI", "Artificial intelligence"],
  ["Artificial intelligence", "AAAI"],
  ["Artificial intelligence", "IJCAI"],
  ["AI", "Computer vision"],
  ["Computer vision", "CVPR"],
  ["Systems", "Computer security"],
  ["Computer security", "NDSS"],
  ["Computer security", "Usenix"],
  ["Computer security", "SP"],
  ["Computer security", "CCS"],
]


/* --- Do not modify after this line ---
Data Tree = Tree string [Tree]
                 ^^name ^^children
*/
const fst = ([a, _]) => a
const snd = ([_, a]) => a
const buildTree = (edges = [], root = "") => {
  const [adjacent, notAdjacent] = edges.reduce(
    (acc, cur) => fst(cur) === root ?
      [[...fst(acc), cur], snd(acc)] :
      [fst(acc), [...snd(acc), cur]],
    [[], []])

  const t = buildTree1Depth(adjacent, root)
  if (t.children.length === 0) {
    return { name: root }
  }
  t.children = t.children.map(tre => buildTree(notAdjacent, tre.name))
  return t
}

const buildTree1Depth = (edges = [], parent = "") => ({
  name: parent,
  children: edges.reduce((acc, cur) => fst(cur) === parent ? [...acc, { name: snd(cur) }] : acc, [])
})

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