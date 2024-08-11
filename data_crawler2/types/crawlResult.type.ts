
export enum CrawlStatus {
  OK,
  NOT_EXIST_URL,
  NOT_EXIST_VENUE,
}
export type CrawlResult = {
  papers: Paper[]
  statusCode: CrawlStatus,
}