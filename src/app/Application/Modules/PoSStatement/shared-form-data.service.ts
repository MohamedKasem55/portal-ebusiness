import { Injectable } from '@angular/core'
import { FormData } from './shared-form-data.model'

@Injectable()
export class FormDataService {
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
