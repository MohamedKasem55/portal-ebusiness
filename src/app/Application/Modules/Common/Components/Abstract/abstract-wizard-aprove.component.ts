import { OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AbstractActionSingleAproveService } from '../../Services/Abstract/abstract-action-single-aprove.service'
import { AbstractWizardComponent } from './abstract-wizard.component'

export abstract class AbstractWizardAproveComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  protected constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public router: Router,
    public service: AbstractActionSingleAproveService,
  ) {
    super(fb, translate, router)
  }

  ngOnInit() {
    super.ngOnInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  confirmUnblock(data) {
    this.subscriptions.push(
      this.service.confirmUnblock(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  refuseUnblock(data) {
    this.subscriptions.push(
      this.service.refuseUnblock(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  confirmBlock(data) {
    this.subscriptions.push(
      this.service.confirmBlock(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  refuseBlock(data) {
    this.subscriptions.push(
      this.service.refuseBlock(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  confirmDelete(data) {
    this.subscriptions.push(
      this.service.confirmDelete(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  refuseDelete(data) {
    this.subscriptions.push(
      this.service.refuseDelete(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  confirmModify(data) {
    this.subscriptions.push(
      this.service.confirmModify(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  refuseModify(data) {
    this.subscriptions.push(
      this.service.refuseModify(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  confirmRegister(data) {
    this.subscriptions.push(
      this.service.confirmRegister(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }

  refuseRegister(data) {
    this.subscriptions.push(
      this.service.refuseRegister(data).subscribe((result) => {
        if (result['errorCode'] != '0') {
          this.onError(result)
        } else {
          this.confirmResponse = result
          this.markNextWizardStep()
        }
      }),
    )
  }
}
