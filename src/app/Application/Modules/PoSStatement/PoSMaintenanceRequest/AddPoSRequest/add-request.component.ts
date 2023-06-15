import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { ManageRequestService } from '../manage-request.service'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss'],
})
export class AddRequestComponent implements OnInit, OnDestroy {
  @ViewChild('authorization', { static: false }) authorization: any

  urlBack = ['/posstatement']
  urlRequestStatus = ['/posstatement/pos-maintenance-request/request-status']
  comboType = 'posMaintenanceRequestType'
  comboCity = 'cityType'

  data = {
    terminalNumber: [null, Validators.required],
    contactName: '',
    mobileNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern('(\\+9665|05)[0-9]{8,8}$'),
      ],
    ],
    city: [null, Validators.required],
    requestType: [null, Validators.required],
  }

  element: any = {}
  response: any = {
    /*generateChallengeAndOTP:{"typeAuthentication":"STATIC","challenge":null,"imageQr":null,"noQr":false}*/
  }
  requestValidate: any = {}
  batchList: any = []

  types: any = []
  cities: any = []

  terminals: any
  branch: any
  mobile: any
  step: number

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public service: ManageRequestService,
    private router: Router,
    public storage: StorageService,
  ) {
    this.step = 1
    this.element = this.fb.group(this.data)
    this.branch = JSON.parse(storage.retrieve('currentUser'))['company'][
      'branchNameEn'
    ]
    this.mobile = JSON.parse(storage.retrieve('currentUser'))['user']['mobile']
    this.element.controls.mobileNumber.patchValue(this.mobile)
    if (!this.branch) {
      this.branch = JSON.parse(storage.retrieve('currentUser'))['company'][
        'branchName'
      ]
    }
  }

  next() {
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.service
            .validate(this.element.value, this.branch)
            .subscribe((result) => {
              if (
                result.hasOwnProperty('error') &&
                (<any>result).error instanceof Exception
              ) {
                this.onError(result)
                return
              } else {
                this.response = result
                this.batchList = this.extractBatch(
                  result.batch ? result.batch : result.batchList,
                )
                this.nextStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirm(this.response, this.requestValidate)
            .subscribe((result) => {
              if (
                result.hasOwnProperty('error') &&
                (<any>result).error instanceof Exception
              ) {
                this.onError(result)
                return
              } else {
                this.nextStep()
              }
            }),
        )
        break
      case 3:
        this.nextStep()
        this.element = this.fb.group(this.data)
        this.requestValidate = {}
        break
    }
  }

  extractBatch(batchList) {
    const list: any = []
    for (let i = 0; i < batchList.notAllowed.length; i++) {
      list.push(batchList.notAllowed[i])
    }
    for (let i = 0; i < batchList.toProcess.length; i++) {
      list.push(batchList.toProcess[i])
    }
    for (let i = 0; i < batchList.toAuthorize.length; i++) {
      list.push(batchList.toAuthorize[i])
    }
    return list
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
    this.element.reset()
    this.refreshCombos()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe(
        function (event: LangChangeEvent) {
          this.refreshCombos()
        }.bind(this),
      ),
    )
    this.subscriptions.push(
      this.service.getTerminals().subscribe((result) => {
        this.terminals = []
        result.terminals.forEach((a) => {
          this.terminals.push({ terminalNumber: a })
        })
        //["0000001","0000002","0000003","0000004"].forEach(a => {
        //    this.terminals.push({terminalNumber:a});
        //});
      }),
    )
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

  refreshCombos() {
    const combosSolicitados = [this.comboType, this.comboCity]
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        const type = this.comboType
        const city = this.comboCity
        this.types = []
        this.cities = []
        const index = Object.keys(
          data[combosSolicitados.indexOf(type)]['values'],
        ).sort(function (a, b) {
          return a > b ? 1 : b > a ? -1 : 0
        })
        for (let i = 0; i < index.length; i++) {
          this.types.push({
            key: index[i],
            value: data[combosSolicitados.indexOf(type)]['values'][index[i]],
          })
        }
        const index2 = Object.keys(
          data[combosSolicitados.indexOf(city)]['values'],
        ).sort(function (a, b) {
          return data[combosSolicitados.indexOf(city)]['values'][a] >
            data[combosSolicitados.indexOf(city)]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf(city)]['values'][b] >
              data[combosSolicitados.indexOf(city)]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index2.length; i++) {
          this.cities.push({
            key: index2[i],
            value: data[combosSolicitados.indexOf(city)]['values'][index2[i]],
          })
        }
      })
  }

  goRequestStatus() {
    this.router.navigate(this.urlRequestStatus)
  }

  goBack() {
    this.router.navigate(this.urlBack)
  }

  isValid() {
    return (
      this.element.valid &&
      (this.step != 2 ||
        (this.step == 2 &&
          (!this.authorization ||
            (this.authorization && this.authorization.valid()))))
    ) //CHANGE eliminar el not
  }
}
