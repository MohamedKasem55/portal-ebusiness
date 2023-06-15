import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { interval, Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { RequestStatusService } from '../request-status.service'
import { RequestReactivateStep1Component } from './request-reactivate-step1.component'
import { RequestReactivateStep2Component } from './request-reactivate-step2.component'
import { RequestReactivateService } from './request-reactivate.service'

@UntilDestroy()
@Component({
  selector: 'app-request-reactivate',
  templateUrl: './request-reactivate.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('reportPayerModal', { static: true })
  public reportPayerModal: ModalDirective
  @ViewChild('reportErrorTable') table: any

  public step1RequestReactivate: RequestReactivateStep1Component
  public step2RequestReactivate: RequestReactivateStep2Component

  step: number
  option: string

  DeleteOption = 'delete'
  InitiateOption = 'initiate'

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  directDebitPayment: any
  paymentDate: any
  datos: any = {}

  requestReactivate = {}

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate

  initiateBatch: any

  cic: any
  companyName: any
  orginatorId: any

  constructor(
    public service: RequestReactivateService,
    private fb: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private requestStatusService: RequestStatusService,
    public storage: StorageService,
  ) {
    super()
    this.step = 1
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.cic = JSON.parse(storage.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
    this.companyName = JSON.parse(storage.retrieve('currentUser'))['company'][
      'companyName'
    ]
    this.orginatorId = JSON.parse(storage.retrieve('currentUser'))['company'][
      'originatorId'
    ]
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.requestReactivate['initialBatch'] =
      this.requestStatusService.getDataElement()
    this.requestReactivate['type'] = this.requestStatusService.getTypeData()
  }

  onInitStep1(events) {
    //console.log('onInitStep1', events);
    this.step1RequestReactivate = events
  }

  onInitStep2(events) {
    //console.log('onInitStep2', events);
    this.step2RequestReactivate = events
  }

  next() {
    switch (this.step) {
      case 1:
        this.option = null
        break
      case 2:
        if (this.option == this.InitiateOption) {
          if (this.requestReactivate['type'] == 'single') {
            this.datos = {}
            this.subscriptions.push(
              this.service
                .save(
                  this.step2RequestReactivate.batch,
                  this.step2RequestReactivate.requestValidate,
                )
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)

                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          } else {
            this.subscriptions.push(
              this.service
                .saveUpload(
                  this.step2RequestReactivate.batch,
                  this.step2RequestReactivate.requestValidate,
                )
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)

                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          }
        } else if (this.option == this.DeleteOption) {
          if (this.requestReactivate['type'] == 'single') {
            this.subscriptions.push(
              this.service
                .delete(this.step2RequestReactivate.batch)
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)

                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          } else {
            this.subscriptions.push(
              this.service
                .deleteUpload(this.step2RequestReactivate.batch)
                .subscribe((result) => {
                  if (result instanceof Exception) {
                    this.onError(result)

                    return
                  } else {
                    this.requestReactivate['final'] = result
                    this.nextStep()
                  }
                }),
            )
          }
        }
        break
      case 3:
        this.nextStep()

        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.option = null
    }
  }

  isValidForm() {
    return this.step2RequestReactivate.valid()
  }

  delete() {
    this.option = this.DeleteOption
    this.initiateBatch = this.requestReactivate['initialBatch']
    this.nextStep()
  }

  initiate() {
    this.option = this.InitiateOption
    if (this.requestReactivate['type'] == 'single') {
      this.subscriptions.push(
        this.service
          .reInitiate(
            this.step1RequestReactivate.batch,
            this.step1RequestReactivate.paymentDate,
          )
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)

              return
            } else {
              this.requestReactivate['initiate'] = result
              this.generateChallengeAndOTP = result.generateChallengeAndOTP
              this.initiateBatch = result
              this.nextStep()
            }
          }),
      )
    } else {
      this.subscriptions.push(
        this.service
          .reInitiateUpload(
            this.step1RequestReactivate.batch,
            this.step1RequestReactivate.paymentDate,
          )
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError(result)

              return
            } else {
              this.requestReactivate['initiate'] = result
              if (this.requestReactivate['initiate'].linesWithError > 0) {
                this.datos = this.requestReactivate['initiate']
                this.reportPayerModal.show()
              } else {
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.initiateBatch = result
                this.nextStep()
              }
            }
          }),
      )
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
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  finish() {
    this.step = 1
    this.router.navigate(['/direct-debits/request-status'])
  }
}
