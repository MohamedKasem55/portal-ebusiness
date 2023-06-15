import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-add-claim-step2',
  templateUrl: './add-claim-step2.component.html',
  styleUrls: ['./add-claim.component.scss'],
})
export class AddClaimStep2Component implements OnInit, OnDestroy {
  @Input() form: FormGroup

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor() {}

  ngOnInit() {}

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

  get elements(): FormGroup[] {
    return this.form.controls['elements']['controls']
  }
}
