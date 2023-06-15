import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { interval, Subscription } from 'rxjs'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Exception } from '../../../../Model/exception'
import { StaticService } from '../../../Common/Services/static.service'
import { ClaimShareService } from '../claim-share.service'
import { ClaimService } from '../claim.service'

@Component({
  selector: 'app-add-claim-employee',
  templateUrl: './add-claim.component.html',
  styleUrls: ['./add-claim.component.scss'],
})
export class AddClaimComponent implements OnInit, OnDestroy {
  @ViewChild('authorization', { static: false }) authorization: any

  step: number
  form: FormGroup
  initData: any

  mensajeError: any = {}
  subscriptions: Subscription[] = []
  combosSolicitados: string[] = ['claimType', 'claimStatus']

  selectedData: any

  response: any = {
    /*generateChallengeAndOTP:{"typeAuthentication":"STATIC","challenge":null,"imageQr":null,"noQr":false}*/
  }
  requestValidate: any = {}
  confirmResponse: any
  mobile: any
  sharedData = {
    file: [],
  }

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ClaimService,
    private router: Router,
    public serviceData: ClaimShareService,
    public storage: StorageService,
  ) {
    this.step = 1
    this.form = fb.group({
      mobile: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern('(\\+9665|05)[0-9]{8,8}$'),
        ],
      ],
      elements: fb.array([]),
    })
    this.mobile = JSON.parse(storage.retrieve('currentUser'))['user']['mobile']

    this.form.controls.mobile.patchValue(this.mobile)
  }

  next() {
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.service
            .validate(this.form.value, this.sharedData.file)
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                //console.log('error',result);
                return
              } else {
                this.response = result
                //console.log('response',this.response);
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
                this.confirmResponse = result
                this.nextStep()
              }
            }),
        )
        break
      case 3:
        this.serviceData.clearSelectedData()
        this.router.navigate(['/posstatement/claims/add'])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.router.navigate(['/posstatement/claims/add'])
    }
  }

  ngOnInit() {
    this.selectedData = this.serviceData.getSelectedData()
    this.initData = this.serviceData.getDataInit()
    this.serviceData.clearDataInit()
    for (let i = 0; this.selectedData.length > i; i++) {
      //console.log('create employee');
      this.createElementForm(this.form, this.selectedData[i], i)
    }
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data: any = result
        }),
    )
  }

  createElementForm(form: FormGroup, element: any, index: any) {
    const control = form.controls['elements'] as FormArray
    control.push(this.initElementForm(element, index))
  }

  initElementForm(element: any, index): FormGroup {
    this.sharedData.file.push(null)
    const formElement = this.fb.group({
      fileName: [null, Validators.required],
      fileIndex: index,
      amountForCur: element.amountForCur,
      amountSARCur: element.amountSARCur,
      cardType: element.cardType,
      cardTypeDesc: element.cardTypeDesc,
      currencyForCur: element.currencyForCur,
      currencySARCur: element.currencySARCur,
      merchantName: element.merchantName,
      merchantNum: element.merchantNum,
      networkTypeDesc: element.networkTypeDesc,
      terminalAddr: element.terminalAddr,
      terminalID: element.terminalID,
      terminalLocation: element.terminalLocation,
      terminalStatusDesc: element.terminalStatusDesc,
      trxnAcct: element.trxnAcct,
      trxnClaimFlg: element.trxnClaimFlg,
      trxnDate: element.trxnDate,
      trxnID: element.trxnID,
      trxnMaskedCardNum: element.trxnMaskedCardNum,
      trxnProcessedFlg: element.trxnProcessedFlg,
      trxnRevFlg: element.trxnRevFlg,
      trxnTime: element.trxnTime,
      trxnType: element.trxnType,
      trxnTypeDesc: element.trxnTypeDesc,
    })
    return formElement
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

  isValid() {
    return (
      this.form.valid &&
      (this.form.controls['elements'] as FormArray).controls.length != 0 &&
      (this.step != 2 ||
        (this.step == 2 &&
          ((this.authorization && this.authorization.valid()) ||
            !this.authorization)))
    ) //CHANGE eliminar el not
  }
}
