import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-modify-payer-step1',
  templateUrl: './modify-payer-step1.component.html',
  styleUrls: ['./modify-payer.component.scss'],
})
export class ModifyPayerStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() banks: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit() {}

  removeElement(index) {
    const control = <FormArray>this.form.controls['elements']
    control.removeAt(index)
    if (control.length == 0) {
      this.router.navigate(['/direct-debits/manage-payer'])
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
