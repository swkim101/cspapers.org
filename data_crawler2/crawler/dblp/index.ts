import Crawlable from "../crawlable";
import DblpCrawlerCommon from "./common";
import DblpCrawlerPacmpl from "./pacmpl";

const NewDblpCrawler = (type: string): Crawlable => {
  switch (type) {
  case "common":
    // todo: DI semantic-scholar crawler
    // todo: DI QoS handler
    return new DblpCrawlerCommon()
  case "pacmpl":
    return new DblpCrawlerPacmpl()
  default:
    console.error(`no such dblp cralwer ${type}`)
    process.exit(1)
  }
}

export default NewDblpCrawler