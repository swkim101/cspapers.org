import { CrawlResult } from "../types/crawlResult.type";

export default interface Crawlable {
  crawl(url: string, venue: string): Promise<CrawlResult>
}
