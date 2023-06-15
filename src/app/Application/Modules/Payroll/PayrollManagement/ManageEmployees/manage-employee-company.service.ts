import { Injectable } from '@angular/core'

@Injectable()
export class ManageEmployeeCompanyService {
  data: any = null
  selectedData: any = null
  tableSelectedRows = []

  getData() {
    const a = this.data
    this.data = null
    return a
  }

  setData(_data) {
    this.data = _data
  }

  getSelectedData() {
    const a = this.selectedData
    this.selectedData = null
    return a
  }

  setSelectedData(_data) {
    this.selectedData = _data
  }

  clear() {
    this.data = null
    this.selectedData = null
  }
}
