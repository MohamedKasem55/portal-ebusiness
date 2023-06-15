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
  urlRequestStatus = ['/posstatement/pos-manage-request/request-status']
  comboType = 'posManagementRequestType'
  comboCity = 'cityType'

  data = {
    accountNumber: [null],
    city: [null, Validators.required],
    contactName: '',
    mobileNumber: [
      '',
      [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern('(\\+9665|05)[0-9]{8,8}$'),
      ],
    ],
    terminalNumber: [null, Validators.required],
    requestType: [null, Validators.required],
  }

  formModel: any = {}
  response: any = {
    /*generateChallengeAndOTP:{"typeAuthentication":"STATIC","challenge":null,"imageQr":null,"noQr":false}*/
  }
  requestValidate: any = {}
  batchList: any = []

  types: any = []
  cities: any = []

  terminals: any
  comboAccounts: any
  accounts: any

  branch: any
  step: number
  mobile: any
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
    this.formModel = this.fb.group(this.data)
    this.branch = JSON.parse(storage.retrieve('currentUser'))['company'][
      'branchNameEn'
    ]
    this.mobile = JSON.parse(storage.retrieve('currentUser'))['user']['mobile']
    this.formModel = this.fb.group(this.data)
    this.formModel.controls.mobileNumber.patchValue(this.mobile)
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
            .validate(this.formModel.value, this.comboAccounts, this.branch)
            .subscribe((result) => {
              if (result instanceof Exception) {
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
        this.nextStep()
        this.formModel = this.fb.group(this.data)
        this.requestValidate = {}
        break
    }
  }

  extractBatch(batchList) {
    const list: any = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < batchList.notAllowed.length; i++) {
      list.push(batchList.notAllowed[i])
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < batchList.toProcess.length; i++) {
      list.push(batchList.toProcess[i])
    }
    // tslint:disable-next-line:prefer-for-of
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
    this.formModel.reset()
    this.refreshCombos()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshCombos()
      }),
    )
    this.subscriptions.push(
      this.service.getTerminals().subscribe((result) => {
        this.terminals = []
        result.terminals.forEach((a) => {
          this.terminals.push({ terminalNumber: a })
        })
        /*["0000001","0000002","0000003","0000004","0000005","0000006","0000007","0000008","0000009","0000010",
                    "0000011","0000012","0000013","0000014","0000015","0000016","0000017","0000018","0000019","0000020",
                    "0000021","0000022","0000023","0000024","0000025","0000026","0000027","0000028","0000029","0000030"].forEach(a => {
                        this.terminals.push({terminalNumber:a});
                    });*/
      }),
    )
    this.subscriptions.push(
      this.service.getAccounts().subscribe((result) => {
        this.accounts = result.accountListDTO
        this.comboAccounts = this.extractAccountKeyValue(this.accounts)
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
    const combosSolicitados = [this.comboCity, this.comboType]
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        this.types = []
        this.cities = []
        const index2 = Object.keys(
          data[combosSolicitados.indexOf(this.comboCity)]['values'],
        ).sort((a, b) => {
          return data[combosSolicitados.indexOf(this.comboCity)]['values'][a] >
            data[combosSolicitados.indexOf(this.comboCity)]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf(this.comboCity)]['values'][b] >
              data[combosSolicitados.indexOf(this.comboCity)]['values'][a]
            ? -1
            : 0
        })
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < index2.length; i++) {
          this.cities.push({
            key: index2[i],
            value:
              data[combosSolicitados.indexOf(this.comboCity)]['values'][
                index2[i]
              ],
          })
        }

        const index = Object.keys(
          data[combosSolicitados.indexOf(this.comboType)]['values'],
        ).sort((a, b) => {
          return a > b ? 1 : b > a ? -1 : 0
        })
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < index.length; i++) {
          this.types.push({
            key: index[i],
            value:
              data[combosSolicitados.indexOf(this.comboType)]['values'][
                index[i]
              ],
          })
        }
      })
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    if (account) {
      for (let i = 0; account.length > i; i++) {
        accountKeyValue.push({ key: i, value: account[i] })
      }
    }
    return accountKeyValue
  }

  goRequestStatus() {
    this.router.navigate(this.urlRequestStatus)
  }

  goBack() {
    this.router.navigate(this.urlBack)
  }

  isValid() {
    return (
      this.formModel.valid &&
      (this.step != 2 ||
        (this.step == 2 &&
          (!this.authorization ||
            (this.authorization && this.authorization.valid()))))
    ) //CHANGE eliminar el not
  }
}
