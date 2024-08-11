import * as fsSync from 'fs'
import * as fs from 'fs/promises'

const toFilePath = (year: number, venue: string, title: string) => `data/${year}/${venue}/${title.replace(/\//, " ")}`
const isEmpty = path => {
  const stat = fsSync.statSync(path)
  return stat.size === 0
}
const exists = (path) => fsSync.existsSync(path)


const save = async (venue: Venue, paper: Paper) => {
  const { title, abstract } = paper
  const filepath = toFilePath(venue.year, venue.name, title)
  const stat = Statistics.instance
  const fs = {
    mkdir: console.log,
    writeFile: console.log,
  }
  // const fs = {
  //   mkdir: nop,
  //   writeFile: nop,
  // }
  if (abstract === "") {
    stat.inc("noabs")
  }
  try {
    await fs.mkdir(`data/${venue.year}/${venue}`, { recursive: true })
    if (!exists(filepath) || (isEmpty(filepath) && abstract !== "")) {
      await fs.writeFile(filepath, abstract)
      stat.inc("saved")
    }
  } catch (e) {
    panic(e)
  }
}

export { save }