import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-modify-employee-step2',
  templateUrl: './modify-employee-step2.component.html',
  styleUrls: ['./modify-employee.component.scss'],
})
export class ModifyEmployeeStep2Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() banksMap: any
  @Input() departments

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  //banksMap: Map<string,string> = new Map<string,string>();
  departmentsMap: Map<string, string> = new Map<string, string>()

  constructor(private fb: FormBuilder) {}

  getDepartment(value) {
    if (value) {
      return this.departmentsMap.get(value)
    }
    return null
  }

  ngOnInit() {
    if (this.departments) {
      for (let i = this.departments.length - 1; i >= 0; i--) {
        this.departmentsMap.set(
          this.departments[i].key,
          this.departments[i].value,
        )
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  get employees(): FormGroup[] {
    return this.form.controls['employees']['controls']
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
