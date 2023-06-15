import {
  AfterViewInit,
  Component, EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { StorageService } from 'app/core/storage/storage.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-secured-authentication',
  templateUrl: './secured-authentication.component.html',
})
export class SecuredAuthentication
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @ViewChild('password') password: any
  @ViewChild('otp') otp: any
  @ViewChild('ivr') ivr: any
  @ViewChild('challengeResponse') challengeResponse: any
  @ViewChild('challengeResponseInput') challengeResponseInput: any
  @ViewChild('otpInput') otpInput: any
  @ViewChild('passwordInput') passwordInput: any

  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() timer: number
  @Input() requestValidate: RequestValidate = new RequestValidate()
  @Input() showBeneficiaryTip = true
  @Input() ivrCustomMessage: string
  @Output() onTimerFinish = new EventEmitter<Component>()
  @Output() onChangeEvent =new EventEmitter<boolean>();

  userTemp: any
  subscription: Subscription
  otpTimer = 420 //7 minutos
  ivrTimer = 420 //7 minutos

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    setTimeout(
      () =>
        (this.generateChallengeAndOTP.challengeCode =
          this.generateChallengeAndOTP.challengeCode),
      5000,
    )
    if (this.timer && this.timer > 0 && this.timer <= this.otpTimer) {
      this.otpTimer = this.timer
    }
    if (this.timer && this.timer > 0 && this.timer <= this.ivrTimer) {
      this.ivrTimer = this.timer
    }

    const storageVal = this.storage.retrieve('currentuser')
    if (!storageVal) {
      return
    }
    this.userTemp = JSON.parse(storageVal)

    if (this.generateChallengeAndOTP) {
      this.requestResponse()
    } else {
      let retry = 10
      const retrieTimer = setInterval(() => {
        if (this.generateChallengeAndOTP) {
          this.requestResponse()
          clearInterval(retrieTimer)
        }
        retry--
        if (retry == 0) {
          clearInterval(retrieTimer)
        }
      }, 1000)
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChallengeNumber()
  }

  updateChallengeNumber() {
    if (
      this.requestValidate &&
      this.generateChallengeAndOTP &&
      this.generateChallengeAndOTP.typeAuthentication == 'CHALLENGE'
    ) {
      this.requestValidate.challengeNumber =
        this.generateChallengeAndOTP.challengeCode
    }
  }

  requestResponse() {
    if (this.generateChallengeAndOTP.typeAuthentication == 'CHALLENGE') {
      this.requestValidate.challengeNumber =
        this.generateChallengeAndOTP.challengeCode
    } else if (this.generateChallengeAndOTP.typeAuthentication == 'OTP') {
      const interval = setInterval((t) => {
        this.otpTimer--
        if (this.otpTimer == 0) {
          clearInterval(interval)
          this.onTimerFinish.emit()
        }
      }, 1000)
    } else if (this.generateChallengeAndOTP.typeAuthentication == 'IVR') {
      const interval = setInterval((t) => {
        this.ivrTimer--
        if (this.ivrTimer == 0) {
          clearInterval(interval)
          this.onTimerFinish.emit()
          console.log("hello");
          
        }
      }, 1000)
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  valid() {
    if (
      this.generateChallengeAndOTP &&
      this.generateChallengeAndOTP.typeAuthentication == 'CHALLENGE'
    ) {
      return this.challengeResponse && this.challengeResponse.valid
    } else if (
      this.generateChallengeAndOTP &&
      this.generateChallengeAndOTP.typeAuthentication == 'OTP'
    ) {
      return this.otp && this.otp.valid
    } else if (
      this.generateChallengeAndOTP &&
      this.generateChallengeAndOTP.typeAuthentication == 'IVR'
    ) {
      return this.ivr && this.ivr.valid
    } else if (
      this.generateChallengeAndOTP &&
      this.generateChallengeAndOTP.typeAuthentication == 'STATIC'
    ) {
      return this.password && this.password.valid
    } else {
      return true
    }
  }

  ngAfterViewInit() {
    if (this.challengeResponseInput) {
      this.challengeResponseInput.nativeElement.focus()
    } else if (this.otpInput) {
      this.otpInput.nativeElement.focus()
    } else if (this.passwordInput) {
      this.passwordInput.nativeElement.focus()
    }
  }

  changeOTP() {
      this.onChangeEvent.emit(/[0-9]{4,6}/.test(this.requestValidate.otp));
  }

}
