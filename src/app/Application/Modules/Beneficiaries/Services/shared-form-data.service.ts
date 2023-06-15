import { Injectable } from '@angular/core'
import { FormData } from '../Model/shared-form-Data.model'

@Injectable()
export class FormDataService {
  formData: FormData = new FormData()
  sharedData: any = null

  getData(): FormData {
    return this.formData
  }

  setData(formData: FormData) {
    this.formData = formData
  }

  getSharedData(): any {
    return this.sharedData
  }

  setSharedData(data: any) {
    this.sharedData = data
  }

  deleteData() {
    this.formData = new FormData()
    this.sharedData = null
  }
}
