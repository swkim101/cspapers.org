const seq = (start, end, step = 1) => Array.from({ length: Math.floor((end - start)/step) }, (_, i) => start + i * step)

const prefix = 'https://dblp.org/db/conf'
const names = [
  [
    "asplos",
    (year) => seq(1, 5).map(vol => `${prefix}/asplos/asplos${year}-${vol}.html`)
  ],
  [
    "eurocrypt",
    (year) => seq(1, 8).map(vol => `${prefix}/eurocrypt/eurocrypt${year}-${vol}.html`)
  ],
  [
    "crypto",
    (year) => seq(1, 6).map(vol => `${prefix}/crypto/crypto${year}-${vol}.html`)
  ],  
]

const flattenName = year => names.reduce((acc, [name, fn]) =>
  [...acc, ...fn(year).map(url => [name, url])]
, [])

const venues = flattenName(2024).map(([name, url]) => ({
  name,
  year: 2024,
  crawler: "dblp-common",
  url,
}))

module.exports = venues