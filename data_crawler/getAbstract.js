const fs = require('fs')
const path = require('path');

/*
  limits:
  15 RPM (requests per minute)
  1 million TPM (tokens per minute)
  1,500 RPD (requests per day)
*/
const API_KEY = fs.readFileSync('./data_crawler/gemini_api_key', { encoding: 'utf-8' })
const GEMINI_URI = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`

/**
 * 
 * @param {string} dir 
 * @param {(dir: string, file: string, stats: fs.Stats) => void} fn 
 */
function walk(dir, fn) {
    const files = fs.readdirSync(dir);
    files.map(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        fn(dir, file, stats)
        if (stats.isDirectory()) {
          walk(filePath, fn);
        }
    })
}

const newRequest = (title) => {
  return {
    contents: [
      {
        role: "user",
        parts: [
          { text: `Return an abstract in plaintext, no markdown. ${title}`}
        ]
      }
    ]
  }
}

/**
 * 
 * @param {string} title 
 * @returns {Promise<string>}
 */
const getAbstract = async (title) => {
  const req = newRequest(title)
  const res = await fetch(GEMINI_URI, {
    method: "POST",
    body: JSON.stringify(req),
  })
  if (res.ok) {
    const json = await res.json()
    console.log(JSON.stringify(json, null, 2))
    const abstract = json.candidates?.map(e => e?.content?.parts?.map(a => a.text))
      ?.flat()
      ?.join("\n")
    if (abstract && !abstract.includes("<pad><pad><pad><pad><pad><pad><pad>")) {
      return `A>\n${abstract}`
    }
    return ""
  }
  return ""
}

(async () => {
  const queue = []
  const failed = []

  // consumer. send a query per 4.5 second.
  setInterval(async () => {
    const last = queue.pop()
    if (!last) { return }
    const [title, file] = last
    const abstract = await getAbstract(title)
    if (abstract === "") {
      console.log (`abs failed: ${title}`)
      failed.push(title)
    } else {
      fs.writeFileSync(file, abstract)
    }
    console.log (title, "\n", abstract)
  }, 4500)

  // logger
  setInterval(async () => {
    console.log(`queue ${queue.length} failed ${failed.length}`)
  }, 3000)

  // producer
  walk("./data", (dir, file, stats) => {
    if (stats.isDirectory()) { return }
    if (0 < stats.size) { return }

    queue.push([file, `${dir}/${file}`])
  })

})()
