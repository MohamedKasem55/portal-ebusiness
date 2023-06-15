import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormGroup } from '@angular/forms'


@Component({
  selector: 'uRPayComponentPayDetails',
  templateUrl: './pay-details.component.html',
  styleUrls: ['./pay-details.component.scss'],
})
export class PayDetailsComponent implements OnInit {

  @Input() formModel: FormGroup

  @Input() accounts: any
  // @Input() purposes: any

  constructor(
    public router: Router,
    public translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    if (this.formModel.controls['account'].value.accountPk) {
      this.accounts.forEach((element: any) => {
        if (element.accountPk == this.formModel.controls['account'].value.accountPk) {
          this.formModel.controls['account'].patchValue(element)
        }
      })
    }
    // if (this.formModel.controls['purpose'].value.purposeCode) {
    //   this.purposes.forEach((element: any) => {
    //     if (element.purposeCode == this.formModel.controls['purpose'].value.purposeCode) {
    //       this.formModel.controls['purpose'].patchValue(element)
    //     }
    //   })
    // }
  }


}
