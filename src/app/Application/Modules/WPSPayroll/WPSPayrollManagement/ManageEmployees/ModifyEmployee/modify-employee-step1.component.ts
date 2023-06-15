import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-modify-employee-step1',
  templateUrl: './modify-employee-step1.component.html',
  styleUrls: ['./modify-employee.component.scss'],
})
export class ModifyEmployeeStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() banksMap: any
  @Input() departments
  @Input() bankList

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  //banksMap: Map<string,string> = new Map<string,string>();

  constructor(private fb: FormBuilder, public router: Router) {}

  ngOnInit() {
    this.form.controls.employees['controls'].forEach((form) => {
      form.controls.account.valueChanges.subscribe((value) => {
        const bankCode = value.length > 6 ? '0' + value.substring(4, 6) : ''
        const bank = this.bankList.find((elem) => {
          return +elem['bankCode'] === +bankCode
        })
        if (bank !== undefined) {
          form.controls.bank.patchValue(bank['bankName'])
        } else if (bank === '' || bank === undefined) {
          form.controls.bank.patchValue(null)
        }
      })
    })
  }

  removeEmployee(index) {
    const control = <FormArray>this.form.controls['employees']
    control.removeAt(index)
    if (control.length == 0) {
      this.router.navigate([
        '/wpspayroll/wpspayroll-management/manage-employees',
      ])
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
