import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-modify-employee-step1',
  templateUrl: './modify-employee-step1.component.html',
  styleUrls: ['./modify-employee.component.scss'],
})
export class ModifyEmployeeStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    ////console.log(this.form);
  }

  removeEmployee(index) {
    const control = this.form.controls['employees'] as FormArray
    control.removeAt(index)
  }

  get employees(): FormGroup[] {
    return this.form.controls['employees']['controls']
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    ////console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
