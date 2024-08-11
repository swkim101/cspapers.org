class Statistics {
  // Singleton
  static #instance: Statistics;
  private constructor() { }

  private stat = {
    crawlerRspCnt: 0,
    saved: 0,
    noabs: 0,
  }
  private startedAt = Date.now()
  private elapsedPoint = Date.now()
  private perSec(metric: number) {
    const elapsed = Date.now() - this.elapsedPoint
    return (metric / elapsed / 1000).toFixed(3)
  }

  public static get instance(): Statistics {
    if (!Statistics.#instance) {
      Statistics.#instance = new Statistics();
    }

    return Statistics.#instance;
  }

  public resetElapsedTime() {
    this.elapsedPoint = Date.now()
  }
  public inc(key: string) {
    this.stat[key]++;
  }
  public dec(key: string) {
    this.stat[key]--;
  }

  public print() {
    const ok = `ok ${this.stat.crawlerRspCnt} (${this.perSec(this.stat.crawlerRspCnt)}/sec)`
    const saved = `saved ${this.stat.saved} (${this.perSec(this.stat.saved)}/sec)`
    const noabs = `noabs ${this.stat.noabs} (${this.perSec(this.stat.noabs)}/sec)`
    console.log(`${ok} ${saved} ${noabs}`)
  }

  public dump() {
    console.log(JSON.stringify(this.stat, null, 2))
  }
}