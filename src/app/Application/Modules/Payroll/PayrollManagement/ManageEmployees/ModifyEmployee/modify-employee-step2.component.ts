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
  @Input() banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  banksMap: Map<string, string> = new Map<string, string>()

  constructor(private fb: FormBuilder) {}

  get employees(): FormGroup[] {
    return this.form.controls['employees']['controls']
  }

  ngOnInit() {
    for (let i = this.banks.length - 1; i >= 0; i--) {
      this.banksMap.set(this.banks[i].key, this.banks[i].value)
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
