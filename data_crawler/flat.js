const dblp = require('./dblp');
const fs = require('fs')

dblp.reduce ((acc, cur) => {

}, [])

// dblp.map(async (e) => {
// try {
//   const filepath = `data_crawler/venue${e.year}.json`
//   if (fs.existsSync(filepath)) {
//     const str = fs.readFileSync(filepath, { encoding: "utf-8" })
//     const json = JSON.parse(str)
//     const url = json.filter(j => j.name === e.name)
//     json.push({ name: e.name, url: [...json.url, url] })
//     fs.writeFileSync(filepath, JSON.stringify(json, null, 2))
//   } else {
//     fs.writeFileSync(filepath, JSON.stringify([{ name: e.name, url: [], crawler: "dblp" }], null, 2))
//   }
// } catch (e) {
//   console.log(e)
// }
// });