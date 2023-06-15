import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-delete-employee-step2',
  templateUrl: './delete-employee-step2.component.html',
  styleUrls: ['./delete-employee.component.scss'],
})
export class DeleteEmployeeStep2Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() banksMap: any
  @Input() departments

  departmentsMap: Map<string, string> = new Map<string, string>()

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder, public router: Router) {}

  get employees(): FormGroup[] {
    return this.form.controls['employees']['controls']
  }

  removeEmployee(index) {
    const control = this.form.controls['employees'] as FormArray
    control.removeAt(index)
    if (control.length == 0) {
      this.router.navigate([
        '/wpspayroll/wpspayroll-management/manage-employees',
      ])
    }
  }

  ngOnInit() {}

  getDepartment(value) {
    if (value) {
      return this.departmentsMap.get(value)
    }
    return null
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
