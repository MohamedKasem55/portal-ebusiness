export interface IDictionary<T> {
  add(key: string, value: T)
  containsKey(key: string): boolean
  count(): number
  item(key: string): T
  keys(): string[]
  remove(key: string): T
  values(): T[]
}

export class Dictionary<T> implements IDictionary<T> {
  private items: { [index: string]: T } = {}

  private _count = 0

  public containsKey(key: string): boolean {
    return this.items.hasOwnProperty(key)
  }

  public count(): number {
    return this._count
  }

  public add(key: string, value: T) {
    if (!this.items.hasOwnProperty(key)) {
      this._count++
    }

    this.items[key] = value
  }

  public remove(key: string): T {
    const val = this.items[key]
    delete this.items[key]
    this._count--
    return val
  }

  public item(key: string): T {
    return this.items[key]
  }

  public keys(): string[] {
    const keySet: string[] = []

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        keySet.push(prop)
      }
    }

    return keySet
  }

  public values(): T[] {
    const values: T[] = []

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        values.push(this.items[prop])
      }
    }

    return values
  }
}
