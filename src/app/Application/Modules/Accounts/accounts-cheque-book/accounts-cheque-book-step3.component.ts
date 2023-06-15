import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
// Import necesarios para trabajar con un modelo de datos compartido.
import { TranslateService } from '@ngx-translate/core'
import { FormData } from '../Model/shared-form-Data.model'
import { FormDataService } from '../Services/shared-form-data.service'

@Component({
  templateUrl: './accounts-cheque-book-step3.component.html',
})
export class AddChequeBookStep3 implements OnInit {
  @Input() formData: FormData
  futureSecurityLevelsLength = 1

  constructor(
    public formDataService: FormDataService,
    public router: Router,
    public translate: TranslateService,
  ) {}

  lastWizardStep() {
    this.formDataService.deleteData()
    this.router.navigate(['/accounts/chequeBookStep1'])
  }

  ngOnInit(): void {
    this.formData = this.formDataService.getData()

    if (
      typeof this.formData != 'undefined' &&
      typeof this.formData.batch != 'undefined' &&
      typeof this.formData.batch.futureSecurityLevelsDTOList != 'undefined' &&
      this.formData.batch != null &&
      this.formData.batch.futureSecurityLevelsDTOList != null
    ) {
      this.futureSecurityLevelsLength =
        this.formData.batch.futureSecurityLevelsDTOList.length
    }
  }
}
