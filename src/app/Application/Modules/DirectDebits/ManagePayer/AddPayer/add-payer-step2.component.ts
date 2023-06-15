import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-add-payer-step2',
  templateUrl: './add-payer-step2.component.html',
  styleUrls: ['./add-payer.component.scss'],
})
export class AddPayerStep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Input() form: FormGroup
  @Input() banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  banksMap: Map<string, string> = new Map<string, string>()

  constructor(private fb: FormBuilder) {
    super()
  }

  get elements(): FormGroup[] {
    return this.form.controls['elements']['controls']
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
    ////console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
