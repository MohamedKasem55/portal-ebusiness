import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { ManageRequestService } from '../manage-request.service'
import { StaticService } from '../../../Common/Services/static.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss'],
})
export class AddRequestComponent implements OnInit, OnDestroy {
  @ViewChild('authorization') authorization: any

  urlBack = ['/posstatement']
  urlRequestStatus = ['/posstatement/pos-request/request-status']
  comboType = 'posRequestType'
  comboCity = 'cityType'

  data = {
    city: [null, Validators.required],
    contactName: '',
    branch: '',
    branchEn: '',
    mobile: [
      '',
      [
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern('(\\+9665|05)[0-9]{8,8}$'),
      ],
    ],
    accountNumber: ['', Validators.required],
    requestType: [null, Validators.required],
    fileName: [null],
  }

  sharedData = {}

  element: FormGroup
  response: any = {
    /*generateChallengeAndOTP:{"typeAuthentication":"STATIC","challenge":null,"imageQr":null,"noQr":false}*/
  }
  requestValidate: RequestValidate
  batchList: any = []

  types: any = []
  cities: any = []

  comboAccounts: any
  accounts: any

  step: number

  mensajeError: any = {}
  subscriptions: Subscription[] = []
  branch: any
  branchEn: any
  mobile: any

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public service: ManageRequestService,
    private router: Router,
    public storage: StorageService,
  ) {
    this.step = 1
    this.requestValidate = new RequestValidate()
    this.branch = JSON.parse(storage.retrieve('currentUser'))['company'][
      'branchName'
    ]
    this.branchEn = JSON.parse(storage.retrieve('currentUser'))['company'][
      'branchNameEn'
    ]
    this.mobile = JSON.parse(storage.retrieve('currentUser'))['user']['mobile']
    this.element = this.fb.group(this.data)
    this.element.controls.branch.patchValue(this.branch)
    this.element.controls.branchEn.patchValue(this.branchEn)
    this.element.controls.mobile.patchValue(this.mobile)
    /*this.element.get('requestType').valueChanges.subscribe(val => {
            //console.log('cambiamos el valor',val);
            if(val == "001"){
                if(!this.element.get('mobile2')){
                    this.element.addControl('mobile2',new FormControl('',Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern("(\\+9665|05)[0-9]{8,8}$")])));
                }
                if(!this.element.get('feesAmount')){
                    this.element.addControl('feesAmount',new FormControl(null,Validators.compose([Validators.required])));
                }
                if(!this.element.get('address')){
                    this.element.addControl('address',new FormControl('',Validators.compose([Validators.required,Validators.maxLength(100)])));
                }
                if(!this.element.get('fullAddress')){
                    this.element.addControl('fullAddress',new FormControl('',Validators.compose([Validators.required,Validators.maxLength(100)])));
                }
                if(!this.element.get('phoneNumber')){
                    this.element.addControl('phoneNumber',new FormControl('',Validators.compose([Validators.required,Validators.maxLength(100)])));
                }
                if(!this.element.get('pobox')){
                    this.element.addControl('pobox',new FormControl('',Validators.compose([Validators.required,Validators.maxLength(100)])));
                }
                if(!this.element.get('postalCode')){
                    this.element.addControl('postalCode',new FormControl('',Validators.compose([Validators.required,Validators.maxLength(5)])));
                }
                if(!this.element.get('numberTerminals')){
                    this.element.addControl('numberTerminals',new FormControl('',Validators.compose([Validators.required,Validators.maxLength(2),Validators.max(99)])));
                }
                if(!this.element.get('posBranchNumber')){
                    this.element.addControl('posBranchNumber',new FormControl('',Validators.required));
                }
            }else{
                if(this.element.get('mobile2')){
                    this.element.removeControl('mobile2');
                }
                if(this.element.get('feesAmount')){
                    this.element.removeControl('feesAmount');
                }
                if(this.element.get('address')){
                    this.element.removeControl('address');
                }
                if(this.element.get('fullAddress')){
                    this.element.removeControl('fullAddress');
                }
                if(this.element.get('phoneNumber')){
                    this.element.removeControl('phoneNumber');
                }
                if(this.element.get('pobox')){
                    this.element.removeControl('pobox');
                }
                if(this.element.get('postalCode')){
                    this.element.removeControl('postalCode');
                }
                 if(this.element.get('numberTerminals')){
                    this.element.removeControl('numberTerminals');
                }
                if(this.element.get('posBranchNumber')){
                    this.element.removeControl('posBranchNumber');
                }
            }
            //console.log(this.element);
        });*/
    //this.element = Object.assign({}, this.data);
  }

  next() {
    switch (this.step) {
      case 1:
        //console.log('validate',this.element.value);
        this.subscriptions.push(
          this.service
            .validate(
              this.element.value,
              this.comboAccounts,
              this.sharedData['file'],
            )
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                return
              } else {
                this.response = result
                // this.batchList = this.extractBatch(result.batch?result.batch:result.batchList)
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
                this.requestValidate = new RequestValidate()

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
        this.requestValidate = new RequestValidate()
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
    // this.element.reset();
    this.element.controls.branch.patchValue(this.branch)
    this.refreshCombos()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshCombos()
      }),
    )
    this.subscriptions.push(
      this.service.getAccounts().subscribe((result) => {
        this.accounts = result.accountListDTO
        this.comboAccounts = this.extractAccountKeyValue(this.accounts)
      }),
    )
    //console.log(this.storage.retrieve('currentUser').mobile);
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
        this.types = []
        this.cities = []
        const index = Object.keys(
          data[combosSolicitados.indexOf(this.comboType)]['values'],
        ).sort((a, b) => {
          return a > b ? 1 : b > a ? -1 : 0
        })
        for (let i = 0; i < index.length; i++) {
          if (index[i] != 'R003') {
            this.types.push({
              key: index[i],
              value:
                data[combosSolicitados.indexOf(this.comboType)]['values'][
                  index[i]
                ],
            })
          }
        }
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
        for (let i = 0; i < index2.length; i++) {
          this.cities.push({
            key: index2[i],
            value:
              data[combosSolicitados.indexOf(this.comboCity)]['values'][
                index2[i]
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
      this.element.valid &&
      (this.step != 2 ||
        (this.step == 2 &&
          (!this.authorization ||
            (this.authorization && this.authorization.valid()))))
    ) //CHANGE eliminar el not
  }
}
