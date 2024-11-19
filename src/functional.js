export const seq = (start, end, step = 1) => Array.from({ length: end - start }, (_, i) => start + i * step)
export const isEven = n => n % 2 === 0

export const fst = ([a, _]) => a
export const snd = ([_, a]) => a

/**
 * Build tree from edges.
 * @typedef {{ name: string, children: [Tree] }} Tree
 * @typedef { [ parent: string, child: string ]} Edge
 * @param {[Edge]} edges
 * @param {string} root
 * @returns {Tree}
 */
export const buildTree = (edges, root) => {
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

export const doubleQuotes = (str = "") =>
  str.split('"').slice(0, -1).filter((_, idx) => idx % 2 === 1)

const buildTree1Depth = (edges = [], parent = "") => ({
  name: parent,
  children: edges.reduce((acc, cur) => fst(cur) === parent ? [...acc, { name: snd(cur) }] : acc, [])
})