import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'

// Import necesarios para trabajar con un modelo de datos compartido.
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { FormData } from '../Model/shared-form-Data.model'
import { FormDataService } from '../Services/shared-form-data.service'

@Component({
  templateUrl: '../View/add-beneficiary-step1.component.html',
})
export class AddBeneficiaryStep1 implements OnInit, OnDestroy {
  @Input() formData: FormData
  model: any

  constructor(
    public formDataService: FormDataService,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {
    this.model = {
      alRajhiBeneficiary: '',
      localBeneficiary: '',
      internationalBeneficiary: '',
    }
  }

  ngOnInit() {
    this.formDataService.deleteData()
    this.formData = this.formDataService.getData()
  }

  ngOnDestroy() {
    this.formDataService.setData(this.formData)
  }

  sendTypeBeneficiary(form: any): void {
    this.formDataService.deleteData()
    this.formData = this.formDataService.getData()
    this.formData.dateBirth = null
    this.formData.issueDate = null
    // Depending on the type of beneficiary we go to a page or another
    switch (form.typeOfBeneficiary) {
      case 'alRajhiBeneficiary':
        this.router.navigateByUrl('/beneficiaries/AlrajhiBeneficiary/AddStep2')
        break
      case 'localBeneficiary':
        //urlLocal
        this.router.navigateByUrl('/beneficiaries/LocalBeneficiary/AddStep2')
        break
      case 'internationalBeneficiary':
        //urlInternacional
        this.router.navigateByUrl(
          '/beneficiaries/InternationalBeneficiary/AddStep2',
        )
        break
    }
  }
}
