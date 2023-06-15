import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

import { FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-delete-user-step2',
  templateUrl: './delete-user-step2.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserStep2Component implements OnInit, OnDestroy {
  @Input() users: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(private fb: FormBuilder) {}

  removeEmployee(index) {
    const control = this.users
    control.removeAt(index)
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
