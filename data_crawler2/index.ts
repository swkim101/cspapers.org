import Crawlable from "./crawler/crawlable";
import NewCrawler from "./crawler/crawler";
import { save } from "./file";
import { CrawlResult, CrawlStatus } from "./types/crawlResult.type";

const main = async () => {
  const year = +process.argv[1]
  const venues: Venue[] = await import(`./venues/${year}`)
  setInterval(Statistics.instance.print, 3000)

  /* do not use map */
  venues.map (async (v) => {
    const crawler = NewCrawler(v.crawler)
    for (let url of v.urls) {
      const res = await crawler.crawl(url, v.name)
      if (res.statusCode !== CrawlStatus.OK) {
        continue
      }
      res.papers.map(p => p => save(v, p))
    }
  })
};

(async() => 
  await main()
)()