class Q<T> {
  private q = new Array<T>()
  enq (v: T) {
    this.q = [v, ...this.q]
  }
  deq(): T | undefined {
    return this.q.pop()
  }
  top (): T | undefined {
    return this.q.at(-1)
  }
  enqEnd (v: T) {
    this.q.push(v)
  }
}
