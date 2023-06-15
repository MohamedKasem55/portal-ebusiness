import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Exception } from 'app/Application/Model/exception'
import { AddBeneficiaryService } from './add-beneficiary.service'

@Component({
  selector: 'app-add-beneficiary',
  templateUrl: './add-beneficiary.component.html',
  styleUrls: ['./add-beneficiary.component.scss'],
})
export class AddBeneficiaryComponent implements OnInit, OnDestroy {
  sharedData: any = {}
  wizardStep: number
  currentComponent: any
  previousUrl: any
  nextComponent = false

  mensajeError = {
    errorCode: '',
    errorDescription: '',
  }

  subscriptions: Subscription[] = []

  constructor(
    private service: AddBeneficiaryService,
    public translate: TranslateService,
    public router: Router,
  ) {
    this.wizardStep = 1
  }

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step
  }

  isDisabled() {
    return !this.currentComponent.valid()
  }

  nextStep() {
    switch (this.wizardStep) {
      case 1:
        this.validatePassNumber(this.sharedData.passNumber)
        break
      case 2:
        this.saveAramcoBeneficiary()
        break
      case 3:
        this.finish()
        break
    }
  }

  validatePassNumber(passNumber: any) {
    this.service.validatePassNumber(passNumber).subscribe((res: any) => {
      const result = res
      if (!(result instanceof Exception)) {
        this.sharedData.aramcoCustomer = result.aramcoCustomer
        this.next()
      }
    })
  }

  saveAramcoBeneficiary() {
    this.service
      .saveNewBeneficiary(this.sharedData.aramcoCustomer)
      .subscribe((res: any) => {
        const result = res
        if (!(result instanceof Exception)) {
          this.sharedData.result = result
          this.next()
        }
      })
  }

  next() {
    this.wizardStep++
    this.router.navigate([
      '/aramcoPayments/add-beneficiary/step' + this.wizardStep,
    ])
  }

  backButton() {
    this.wizardStep--
    this.router.navigate([
      '/aramcoPayments/add-beneficiary/step' + this.wizardStep,
    ])
  }

  finish() {
    this.wizardStep = 1
    this.sharedData = {}
    // this.router.navigate(['/aramcoPayments/add-beneficiary/step' + this.wizardStep]);
    this.router.navigate(['/companyadmin/aramco/beneficiaryList'])
  }

  back() {
    this.router.navigate(['/companyadmin/aramco/beneficiaryList'])
  }

  ngOnInit(): void {
    this.previousUrl = this.service.getPreviousUrl()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
