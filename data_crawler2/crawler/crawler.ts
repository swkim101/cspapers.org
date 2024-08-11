import Crawlable from "./crawlable"
import NewDblpCrawler from "./dblp"

const NewCrawler = (name: string): Crawlable => {
  switch(name) {
  case "dblp-common":
    return NewDblpCrawler("common")
  case "dblp-pacmpl":
    return NewDblpCrawler("pacmpl")
  default:
    console.error(`no such cralwer ${name}`)
    process.exit(1)
  }
}

export default NewCrawler