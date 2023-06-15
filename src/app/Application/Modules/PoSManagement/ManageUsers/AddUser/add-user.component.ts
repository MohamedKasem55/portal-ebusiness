import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { StaticService } from '../../../Common/Services/static.service'
import { ManageUserService } from '../manage-user.service'

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit, OnDestroy {
  step: number
  selectedUser: any = {}

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    fb: FormBuilder,
    public staticService: StaticService,
    public service: ManageUserService,
    private router: Router,
  ) {
    this.step = 1
    this.selectedUser = {
      userId: null,
      userName: null,
      mobile: null,
    }
  }

  next() {
    switch (this.step) {
      case 1:
        this.nextStep()
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirmEmployees(this.selectedUser)
            .subscribe((result) => {
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
        this.router.navigate(['/companyadmin/pos/add-pos-user'])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  ngOnInit() {
    this.selectedUser = {
      userId: null,
      userName: null,
      mobile: null,
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
