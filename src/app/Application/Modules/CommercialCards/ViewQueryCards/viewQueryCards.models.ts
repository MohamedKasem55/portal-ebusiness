import { Page } from '../../../Model/page'
export class PagedData<T> {
  data: T[]
  page: Page

  constructor() {
    this.data = new Array<T>()
    this.page = new Page()
  }
}

// tslint:disable-next-line: max-classes-per-file
export class Category {
  key: number
  value: string
}

// tslint:disable-next-line: max-classes-per-file
export class Combo {
  key: number
  value: string
  constructor(_key: number, _value: string) {
    this.key = _key
    this.value = _value
  }
}
