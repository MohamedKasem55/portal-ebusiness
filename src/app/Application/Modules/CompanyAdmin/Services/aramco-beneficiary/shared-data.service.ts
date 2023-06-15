import { Injectable } from '@angular/core'

@Injectable()
export class SharedDataService {
  sharedData: any = {}

  getData() {
    return this.sharedData
  }

  setData(sharedData) {
    this.sharedData = sharedData
  }

  deleteData() {
    this.sharedData = {}
  }
}
