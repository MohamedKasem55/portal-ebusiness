import { Page } from './page'

/**
 * An array of data with an associated page object used for paging
 */
export class PagedData<T> {
  data: Array<T>
  page: Page

  constructor() {
    this.data = new Array<T>()
    this.page = new Page()
  }
}
