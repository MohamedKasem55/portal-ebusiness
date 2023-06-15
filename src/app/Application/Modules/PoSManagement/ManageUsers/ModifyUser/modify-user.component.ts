import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { FormBuilder } from '@angular/forms'
import { Exception } from '../../../../Model/exception'
import { ManageUserService } from '../manage-user.service'
import { UserShareService } from '../user-share.service'

@Component({
  selector: 'app-modify-user',
  templateUrl: './modify-user.component.html',
  styleUrls: ['./modify-user.component.scss'],
})
export class ModifyUserComponent implements OnInit, OnDestroy {
  step: number

  subscriptions: Subscription[] = []

  selectedUser: any

  passwordForm: any

  constructor(
    public fb: FormBuilder,
    public serviceData: UserShareService,
    private service: ManageUserService,
    private router: Router,
  ) {
    this.step = 1
  }

  previous() {
    if (this.step === 1) {
      this.router.navigate(['/companyadmin/pos/user-list'])
    } else {
      this.step = 1
    }
  }

  ngOnInit() {
    this.selectedUser = this.serviceData.getDataInit()
    this.serviceData.clearDataInit()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
  }

  resetPassword() {
    this.passwordForm = this.fb.group({
      password: null,
      confirmationPassword: null,
    })
    this.step = 2
  }

  confirmResetPassword() {
    this.subscriptions.push(
      this.service
        .changePassword(this.selectedUser, this.passwordForm.value)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.step = 3
          }
        }),
    )
  }

  delete() {
    const users = []
    users.push(this.selectedUser)
    this.serviceData.setSelectedData(users)
    this.router.navigate(['/companyadmin/pos/delete-pos-user'])
  }
}
