import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Subscription } from 'rxjs'
/*
import { PagedData } from "../../../../Model/paged-data";
import { Page } from "../../../../Model/page";

import { Exception } from "../../../../Model/exception";
*/
import { TranslateService } from '@ngx-translate/core'
import { ChangePasswordService } from './change-password.service'
import { AuthenticationService } from '../../../../core/security/authentication.service'

@Component({
  selector: 'app-password-step1',
  templateUrl: 'change-password-step1.component.html',
})
export class ChangePasswordStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Output() onInit = new EventEmitter<Component>()

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  oldPass: string
  newPass: string
  previousPass: string

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    public service: ChangePasswordService,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  changePass() {
    //console.log(this.form);
  }
}
