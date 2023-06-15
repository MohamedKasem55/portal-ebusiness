import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

// Services
import { AccountsRequestService } from './accounts-balance-certificate-request.service'
import { Step1Component } from './Steps/Step1/step1.component'
import { Step2Component } from './Steps/Step2/step2.component'
import { AccountFormData } from '../../Services/accounts-form-data.service'
import { StaticService } from '../../../Common/Services/static.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './accounts-balance-certificate-request.component.html',
})
export class AccountsBalanceCertificateRequestComponent
  implements OnInit, OnDestroy
{
  @ViewChild('authorization') authorization: any
  step1: Step1Component
  step2: Step2Component

  model: any
  cities: any = []
  citiesInvert: any = []
  accounts = []

  wizardStep = 1

  validationResponse: any = {}
  confirmResponse: any = {}

  requestValidate: RequestValidate

  subscriptions: Subscription[] = []

  constructor(
    public service: AccountsRequestService,
    public serviceFormData: AccountFormData,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
  ) {
    this.wizardStep = 1
    // Definimos el objeto model, vació inicialmente para la validación de los campos (necesario)
    this.model = {
      account: '',
      company: '',
      postalCode: '',
      city: '',
    }
    this.requestValidate = new RequestValidate()
  }

  onInitStep1(events) {
    //console.log('onInitStep1', events);
    this.step1 = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.step2 = events
  }

  refreshData() {
    const combosSolicitados = ['cityType']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        //console.log(data[combosSolicitados.indexOf("cityType")]);
        this.cities = []
        const index = Object.keys(
          data[combosSolicitados.indexOf('cityType')]['values'],
        ).sort((a, b) => {
          //console.log(a,b);
          return data[combosSolicitados.indexOf('cityType')]['values'][a] >
            data[combosSolicitados.indexOf('cityType')]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf('cityType')]['values'][b] >
              data[combosSolicitados.indexOf('cityType')]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index.length; i++) {
          this.cities.push({
            key: index[i],
            value:
              data[combosSolicitados.indexOf('cityType')]['values'][index[i]],
          })
        }
      })
  }

  ngOnInit() {
    this.refreshData()
    this.service.init().subscribe((result) => {
      if (result === null) {
        this.onError()
      } else {
        //console.log("Lista cuentas: ", );
        const accountList: any = result['accountList']

        for (let i = 0; i < accountList.length; i++) {
          this.accounts.push(accountList[i].fullAccountNumber)
        }
      }
    })

    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event) => {
        this.refreshData()
      }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError() {
    //
  }

  isDisabled() {
    return !(
      (this.wizardStep == 1 && this.step1.form && this.step1.form.valid) ||
      (this.wizardStep == 2 && this.valid())
    )
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return this.authorization.valid()
    }
  }

  nextStep() {
    switch (this.wizardStep) {
      case 1:
        this.service.validate(this.model).subscribe((result) => {
          if (result === null) {
            this.onError()
          } else {
            this.validationResponse = result
            this.next()
          }
        })
        break
      case 2:
        this.service
          .confirm(this.validationResponse.batch, this.requestValidate)
          .subscribe((result) => {
            if (result === null) {
              this.requestValidate = new RequestValidate()

              this.onError()
            } else {
              this.confirmResponse = result
              this.next()
            }
          })
        break
      case 3:
        this.finish()
        break
    }
  }

  next() {
    this.wizardStep++
  }

  backButton() {
    this.wizardStep--
  }

  finish() {
    this.wizardStep = 1
    this.router.navigate(['/accounts/balanceCertificate'])
  }

  back() {
    this.router.navigate(['/accounts/balanceCertificate'])
  }
}
