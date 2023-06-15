import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-delete-payer-step2',
  templateUrl: './delete-payer-step2.component.html',
  styleUrls: ['./delete-payer.component.scss'],
})
export class DeletePayerStep2Component implements OnInit, OnDestroy {
  @Input() form: FormGroup

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder, private router: Router) {}

  removeElement(index) {
    const control = <FormArray>this.form.controls['elements']
    control.removeAt(index)
    if (control.length == 0) {
      this.router.navigate(['/direct-debits/manage-payer'])
    }
  }

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
}
