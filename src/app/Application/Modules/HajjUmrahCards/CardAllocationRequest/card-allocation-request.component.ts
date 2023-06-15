import { Component, OnInit, Injector, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { CardallReqService } from './cardall-req.service'
import { Exception } from '../../../Model/exception'
import { HijraDateFormatPipe } from '../../../Components/common/Pipes/hijra-date-format-pipe'
import { Step1Component } from './Steps/step1/step1.component'
import { Step2Component } from './Steps/step2/step2.component'
import { Step3Component } from './Steps/step3/step3.component'
import { Step4Component } from './Steps/step4/step4.component'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-card-allocation-request',
  templateUrl: './card-allocation-request.component.html',
  styleUrls: ['./card-allocation-request.component.scss'],
})
export class CardAllocationRequestComponent implements OnInit {
  @ViewChild(Step1Component, { static: true })
  step1Request: Step1Component
  @ViewChild(Step2Component, { static: true })
  step2Request: Step2Component
  @ViewChild(Step3Component, { static: true })
  step3Request: Step3Component
  @ViewChild(Step4Component, { static: true })
  step4Request: Step4Component

  form: FormGroup
  cardsallocFormData: any
  step: number
  option: string
  subscriptions: Subscription[] = []
  mensajeError: any = {}
  getDTOData: any
  getuserDTOData: any
  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate
  dateFormat = 'yyyy-MM-dd'

  constructor(
    public fb: FormBuilder,
    public cardservice: CardallReqService,
    private injector: Injector,
    private dateFormatPipe: DateFormatPipe,
    private router: Router,
  ) {
    this.step = 1
    const hijra = new HijraDateFormatPipe(injector)
    const hoy = new Date()
    this.requestValidate = new RequestValidate()
    this.form = this.fb.group({
      cardNumber: ['', Validators.required],
      visaNumber: ['', Validators.required],
      visaDate: ['', Validators.required],
      loadAmount: ['', Validators.required],
      passportNumber: [''],
      mobNumber: [''],
      address: [''],
      reigin: [''],
      city: [''],
      passCode: [''],
      mobnumKSA: [''],
      email: [''],
      hijraDateCard: {
        // value: hoy,
        //value: new HijriDate().subtractDay().ignoreTime().format('dd/mm/yyyy'),
        value: hijra.transform(hoy, 'dd/MM/yyyy'),
        disabled: true,
      },
      // passportNumber: ['',Validators.required],
      //mobNumber: ['',Validators.required]
    })
  }

  ngOnInit() {}

  isDisabled() {
    return !this.form.valid
  }

  next() {
    switch (this.step) {
      case 1:
        this.setPage(null)
        break
      case 2:
        this.validatePage()
        break
      case 3:
        this.confirmPage()
        break
      case 4:
        this.finish()
        break
    }
  }

  setPage(pageInfo) {
    if (this.validForm()) {
      if (pageInfo == null) {
        pageInfo = { offset: 0 }
      }
      /*this.cardsallocFormData = Object.assign({}, this.form.value);
            //console.log(this.cardsallocFormData);*/
      const data = {
        amount: this.form.controls['loadAmount'].value,
        cardNumber: this.form.controls['cardNumber'].value,
        visaIssueDate: this.dateFormatPipe.transform(
          this.form.controls['visaDate'].value,
          this.dateFormat,
        ),
        visaNumber: this.form.controls['visaNumber'].value,
        page: 1,
        rows: 10,
      }
      //console.log(JSON.stringify(data));

      this.subscriptions.push(
        this.cardservice.initiateCard(data).subscribe((result: any) => {
          if (result['errorCode'] !== '0') {
            this.onError(result)
          } else {
            this.getDTOData = result.batchDTO
            this.getuserDTOData = result.hajjUmrahUserDTO
            // this.generateChallengeAndOTP = result.generateChallengeAndOTP;
            this.nextStep()
            //console.log(this.getDTOData);
          }
        }),
      )
    }
  }

  validForm() {
    let result = true
    if (!this.form.controls['loadAmount'].value) {
      this.form.controls['loadAmount'].markAsTouched()
      result = false
    }
    if (!this.form.controls['cardNumber'].value) {
      this.form.controls['cardNumber'].markAsTouched()
      result = false
    }
    if (!this.form.controls['visaDate'].value) {
      this.form.controls['visaDate'].markAsTouched()
      result = false
    }
    if (!this.form.controls['visaNumber'].value) {
      this.form.controls['visaNumber'].markAsTouched()
      result = false
    }
    return result
  }

  validatePage() {
    const data = {
      batchDTO: this.getDTOData,
      address: this.form.controls['address'].value,
      city: this.form.controls['city'].value,
      mobileKSA: this.form.controls['mobnumKSA'].value,
      mobileNumber: this.form.controls['mobNumber'].value,
      passportNumber: this.form.controls['passportNumber'].value,
      postalCode: this.form.controls['passCode'].value,
      stateRegion: this.form.controls['reigin'].value,
      email: this.form.controls['email'].value,
    }
    //console.log(JSON.stringify(data));

    this.subscriptions.push(
      this.cardservice.cardallocValidate(data).subscribe((result: any) => {
        if (result['errorCode'] !== '0') {
          this.onError(result)
        } else {
          this.getDTOData = result.batchDTO
          this.getuserDTOData = result.hajjUmrahUserDTO
          this.generateChallengeAndOTP = result.generateChallengeAndOTP
          this.nextStep()
          //console.log(this.getDTOData);
        }
      }),
    )
  }

  confirmPage() {
    const data = {
      batchDTO: this.getDTOData,
    }
    //console.log(JSON.stringify(data));

    this.subscriptions.push(
      this.cardservice
        .cardAllocConfirm(data, this.requestValidate)
        .subscribe((result: any) => {
          if (result['errorCode'] !== '0') {
            this.onError(result)
          } else {
            this.nextStep()
          }
        }),
    )
  }

  finish() {
    this.step = 1
    this.router.navigate(['/hajjandumrahcards/cardallocationrequest'])
    this.clear()
  }

  nextStep() {
    this.step = ++this.step % 5

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

  clear() {
    this.form.reset()
  }

  onInitStep1(events) {
    this.step1Request = events
  }

  onInitStep2(events) {
    this.step2Request = events
  }

  onInitStep3(events) {
    this.step3Request = events
  }

  onInitStep4(events) {
    this.step4Request = events
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.errorCode
    this.mensajeError['description'] = res.errorDescription
  }
}
