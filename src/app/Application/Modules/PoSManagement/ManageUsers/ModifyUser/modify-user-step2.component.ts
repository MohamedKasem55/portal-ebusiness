import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'

import { FormBuilder, FormGroup } from '@angular/forms'
import { AuthenticationService } from '../../../../../core/security/authentication.service'

@Component({
  selector: 'app-modify-user-step2',
  templateUrl: './modify-user-step2.component.html',
  styleUrls: ['./modify-user.component.scss'],
})
export class ModifyUserStep2Component implements OnInit, OnDestroy {
  @Input() selectedUser: any
  @Input() form: FormGroup

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    private fb: FormBuilder,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
  }
}
