import { CrawlResult, CrawlStatus } from "../../types/crawlResult.type";
import Crawlable from "../crawlable";

export default class DblpCrawlerCommon implements Crawlable {
  async crawl(url: string, venue: string): Promise<CrawlResult> {
    return {
      papers: [{ title: "a", abstract: "b" }],
      statusCode: CrawlStatus.OK
    }
  }
}