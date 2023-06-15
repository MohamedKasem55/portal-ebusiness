import { Injectable } from '@angular/core'

@Injectable()
export class UserShareService {
  dataInit = {}
  selectedData: any = null

  getDataInit() {
    return this.dataInit
  }

  setDataInit(data) {
    this.dataInit = data
  }

  clearDataInit() {
    this.dataInit = {}
  }

  getSelectedData() {
    const a = this.selectedData
    this.selectedData = null
    return a
  }

  setSelectedData(_data) {
    this.selectedData = _data
  }

  clearSelectedData() {
    this.selectedData = null
  }
}
