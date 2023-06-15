import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subject } from 'rxjs'
import { ModelService } from '../../../Components/common/model.service'
import { ChangePasswordStep1Component } from './change-password-step1.component'
import { ChangePasswordStep2Component } from './change-password-step2.component'
import {
  ChangePasswordService,
  PasswordUpdate,
} from './change-password.service'
import { CryptoService } from '../../../../core/crypto/crypto.service'

@Component({
  selector: 'app-change-password',
  templateUrl: 'change-password.component.html',
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  @ViewChild(ChangePasswordStep1Component)
  step1: ChangePasswordStep1Component
  @ViewChild(ChangePasswordStep2Component)
  step2: ChangePasswordStep2Component

  form: FormGroup
  wizardStep = 1
  error: string
  //ViewType = ViewType;
  view: ViewType
  areaCodes: any[]
  private onDestroy$: Subject<void> = new Subject<void>()

  constructor(
    private changePasswordService: ChangePasswordService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private modelService: ModelService,
    private cryptoService: CryptoService,
  ) {
    this.form = fb.group({
      oldPass: ['', Validators.required],
      newPass: ['', Validators.required],
      confirmPass: ['', Validators.required],
    })
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()
  }

  onInitStep1(events) {
    this.step1 = events
  }

  changePassword() {
    //console.log(this.form);
    const form = this.form.value
    const updateData = new PasswordUpdate()
    updateData.oldPassword = this.cryptoService.encryptRSA(form.oldPass)
    updateData.password = this.cryptoService.encryptRSA(form.newPass)
    this.changePasswordService
      .changePassword(updateData)
      .subscribe((result) => {
        if (result.errorCode && result.errorCode != '0') {
          this.error = result.errorDescription
        } else {
          this.nextStep()
        }
      })
  }

  nextStep() {
    this.wizardStep = ++this.wizardStep
    if (this.wizardStep > 2) {
      this.wizardStep = 1
    }
  }

  previous() {
    this.wizardStep = --this.wizardStep
    if (this.wizardStep === 0) {
      this.wizardStep = 1
    }
  }

  isDisabled() {
    return !this.form.valid
  }
}

export enum ViewType {
  DETAIL = 'detail',
  WIZARD = 'wizard',
}
