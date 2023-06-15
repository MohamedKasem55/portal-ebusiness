import { Injectable } from '@angular/core'
import { FormData } from '../Model/shared-form-Data.model'

@Injectable()
export class FormDataService {
  allTerminalsSearch = false
  formData: FormData = new FormData()

  getData(): FormData {
    return this.formData
  }

  setData(formData: FormData) {
    this.formData = formData
  }

  deleteData() {
    this.formData = new FormData()
  }
}
