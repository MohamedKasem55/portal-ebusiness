import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { ManageUserService } from '../manage-user.service'
import { UserShareService } from '../user-share.service'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss'],
})
export class DeleteUserComponent implements OnInit, OnDestroy {
  step: number

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  selectedUser: any

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ManageUserService,
    private router: Router,
    public userShareService: UserShareService,
  ) {
    this.step = 2
  }

  next() {
    switch (this.step) {
      case 2:
        this.subscriptions.push(
          this.service.deleteUser(this.selectedUser).subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)
              return
            } else {
              this.nextStep()
            }
          }),
        )
        break
      case 3:
        this.userShareService.clearSelectedData()
        this.router.navigate(['/companyadmin/pos/user-list'])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 1) {
      this.step = 2
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 1) {
      this.router.navigate(['/companyadmin/pos/user-list'])
    }
  }

  ngOnInit() {
    this.selectedUser = this.userShareService.getSelectedData()
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
