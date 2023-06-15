import { Subscription } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal'
import { ConfigResourceService } from '../../../core/config/config.resource.local'
import { StorageService } from '../../storage/storage.service'
import { AuthenticationService } from '../authentication.service'
import { ContactUsModalComponent } from './components/contact-us-modal/contact-us-modal.component'
import { BannerErrorsMessage, BannerModel } from './models/banner.model'
import { ValidUser } from './models/valid-user.model'
import { MessageModel } from './models/message.model'
import { ResponseGenerateChallenge } from '../../../Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from '../../../Application/Modules/CommercialCards/commercial-cards-models'
import { window } from 'ngx-bootstrap/utils'

@Component({
  selector: 'app-login-rev',
  templateUrl: './login-rev.component.html',
  styleUrls: ['./login-rev.component.scss'],
})
export class LoginRevComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('resetPasswordModal')
  public resetPasswordModal: ModalDirective

  @ViewChild('resetTokenModal')
  public resetTokenModal: ModalDirective

  @ViewChild('openAccountModal')
  public openAccountModal: ModalDirective

  @ViewChild('organizationName', { read: ElementRef })
  orgNameElement: ElementRef

  @ViewChild('otp', { read: ElementRef }) set content(content: ElementRef) {
    if (content) {
      content.nativeElement.focus()
    }
  }

  @ViewChild('challengeInput', { read: ElementRef })
  set content2(content2: ElementRef) {
    if (content2) {
      content2.nativeElement.focus()
    }
  }

  subscriptions: Subscription[] = []

  private url: string
  public loginStep: number
  public loginForm: FormGroup
  public isChallengeUser: boolean
  public banner: BannerModel[] = []
  public errorBanner: BannerErrorsMessage
  public messages: MessageModel[] = []
  public messageActive = true
  public error: ValidUser
  public loginError: string
  public challenge: string
  public returnUrl: any
  public challengeCode: string
  public serial: string
  public isQr: boolean
  private readonly generalPrivilege = 'GENERAL_PRIVILEGE'

  // ----------------------------------------------------------
  public challengeQuestionsTotal = 4
  public challengeQuestionsSelectedOptions: any[] = [0, 0]

  // ----------------------------------------------------------
  public resetPasswordForm: FormGroup
  public resetPasswordFormData: any = {}
  public resetPasswordIsActivated = false
  public resetPasswordStep: number
  public resetPasswordModalZIndex = 1049
  public resetPasswordAuthData = {}

  // ----------------------------------------------------------
  public resetTokenForm: FormGroup
  public resetTokenFormData: any = {}
  public resetTokenIsActivated = false
  public resetTokenStep: number
  public resetTokenModalZIndex = 1049
  public resetTokenShowLinkToReset = false
  public resetTokenAuthData = {}
  public resetTokenIsSoftToken: boolean
  public typeUrl: any

  // ----------------------------------------------------------

  public isIVR = false
  public showRecall = false
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()

  // ----------------------------------------------------------
  ///// LOGIN WITH ID
  public activeTab: number = 1
  public companyList: any = []
  public companyIds: any = []
  public userIds: any = []
  public isOneUser: boolean = false

  // ----------------------------------------------------------


  private isCallReceived = false
  public resetPasswordSteps = [
    'login.answerChallenge.steps.step_confirm_user',
    'login.answerChallenge.steps.step_challenge_questions',
    'login.answerChallenge.steps.step_reset_password',
    'login.answerChallenge.steps.step_finish',
  ]

  public isSolo: number = 0

  constructor(
    private modalService: BsModalService,
    private _http: HttpClient,
    private _config: ConfigResourceService,
    private _fb: FormBuilder,
    public translate: TranslateService,
    private _router: Router,
    public storageService: StorageService,
    public authService: AuthenticationService,
    private route: ActivatedRoute,
    public _sanitizer: DomSanitizer,
  ) {
    this.url = this._config.getServicesUrl()
  }

  ngOnInit() {
    this.loginStep = 1
    this.isChallengeUser = true
    this.error = {} as ValidUser
    this.typeUrl = this.route.snapshot.queryParams['typeUrl']
    if (this.typeUrl) {
      localStorage.setItem('typeUrl', this.typeUrl)
    } else if (localStorage.getItem('typeUrl')) {
      //remove item if exist in storage & missing in URL
      localStorage.removeItem('typeUrl')
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
    this.resetPasswordForm = this._fb.group({
      question0: '',
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      newPassword: '',
      newPasswordConfirm: '',
      challengeNumber: '',
    })
    this.resetTokenForm = this._fb.group({
      question0: '',
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      newPassword: '',
      newPasswordConfirm: '',
      challengeNumber: '',
    })
    this.loginForm = this.getInitialLoginForm(1)

    this._http.get(this.url + '/campaingService').subscribe((res) => {
      this.banner = res['banner']
      this.messages = res['message']
      if (res['errorCode'] != '0') {
        this.errorBanner = res['errorResponse']
      } else if (res['errorCode'] == '0') {
        this.errorBanner = null
      }
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  ngAfterViewInit(): void {
    // this.orgNameElement.nativeElement.focus()
  }

  public getInitialLoginForm(tab) {
    return this._fb.group({
      civilianId: [
        '',
        (tab == 2) ?
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern('^[0-9]*$'),
          ] : [
            Validators.maxLength(10),
            Validators.pattern('^[0-9]*$'),
          ],
      ],
      companyId: [
        '',
        (tab == 1) ?
          [
            Validators.required,
            Validators.maxLength(10),
            Validators.pattern('^[0-9]*$'),
          ] : [
            Validators.maxLength(10),
            Validators.pattern('^[0-9]*$'),
          ],
      ],
      userId: [
        '',
        (tab == 1) ?
          [
            Validators.required,
            Validators.maxLength(30),
            Validators.pattern(
              '[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]*',
            ),
          ] : [
            Validators.maxLength(30),
            Validators.pattern(
              '[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]*',
            ),
          ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]*',
          ),
        ],
      ],
      otp: [
        '',
        [
          Validators.pattern('[0123456789]*'),
          Validators.minLength(4),
          Validators.maxLength(6),
        ],
      ],
      response: [
        '',
        [
          Validators.pattern('[0123456789]*'),
          Validators.minLength(4),
          Validators.maxLength(6),
        ],
      ],
    })
  }

  public contactUs() {
    this.modalService.show(ContactUsModalComponent, {})
  }

  public backStep1() {
    if (this.activeTab == 1) {
      this.loginForm.controls['userId'].enable()
      this.loginForm.controls['companyId'].enable()
      this.loginForm.controls['password'].setValue('')
      this.loginForm.controls['password'].setErrors(null)
      if (this.loginForm.controls['otp'] !== undefined) {
        this.loginForm.controls['otp'].setValue('')
        this.loginForm.controls['otp'].setErrors(null)
      }
      if (this.loginForm.controls['response'] !== undefined) {
        this.loginForm.controls['response'].setValue('')
        this.loginForm.controls['response'].setErrors(null)
      }
      this.orgNameElement.nativeElement.focus()
      this.loginStep = 1
      this.isChallengeUser = false
      this.resetTokenShowLinkToReset = false
    } else {
      this.loginForm.controls['otp'].setValidators([])
      this.loginForm.controls['otp'].setValue('')
      this.loginForm.controls['otp'].setErrors(null)
      this.loginForm.controls['response'].setValidators([])
      this.loginForm.controls['response'].setValue('')
      this.loginForm.controls['response'].setErrors(null)
      switch (this.loginStep) {
        case 1:
          if (this.isOneUser) {
            this.loginStep = 1
          } else {
            this.loginStep = 2
          }
          break
        case 2:
          this.loginForm.controls['civilianId'].enable()
          this.loginForm.controls['password'].enable()
          this.loginForm.controls['password'].setValue('')
          this.loginForm.controls['password'].setErrors(null)
          this.loginForm.controls['companyId'].setValidators([])
          this.loginForm.controls['companyId'].setValue('')
          this.loginForm.controls['userId'].setValidators([])
          this.loginForm.controls['userId'].setValue('')
          this.loginStep = 1
          break
        case 3:
          this.loginForm.controls['companyId'].enable()
          this.loginForm.controls['userId'].enable()
          this.loginStep = 2
          break
      }
    }
  }

  public proceed() {
    const form = this.loginForm.getRawValue()
    let login = false
    this.resetTokenShowLinkToReset = false
    if ((this.loginStep == 2 && !this.isChallengeUser && this.activeTab == 1) ||
      (this.loginStep == 3 && !this.isChallengeUser && this.activeTab == 2)
    ) {
      if (!this.validateInput('otp')) {
        return
      }
      login = true
      this.authService
        .loginOtp(form.userId, form.companyId, form.otp, form.password)
        .subscribe((res) => {
          if (!res['error']) {
            // Renew session
            this.storageService.store(
              'TOKEN_VALIDTY',
              res.tokenValidaityInSecond,
            )

            const currentUser = JSON.parse(
              this.storageService.retrieve('currentUser'),
            )
            const mustAgree = this.authService.mustSignTermsAndConditions(
              this.generalPrivilege,
            )
            const firstLogin: boolean = currentUser.user.firstLogin
            const hasChallengeQuestions: boolean =
              currentUser.hasChallengeQuestions
            const passwordExpired: boolean = currentUser.user.passwordExpired

            if (firstLogin || passwordExpired || !hasChallengeQuestions) {
              if (mustAgree) {
                this._router.navigate(['/terms-and-conditions'], {
                  queryParams: {
                    privilege: this.generalPrivilege,
                    url: '/change-password',
                    isLogin: true,
                  },
                })
              } else {
                this._router.navigateByUrl('/change-password')
              }
              return
            }
            this.authService.initateUser().subscribe((result) => {
              let response = null

              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < result.length; i++) {
                if (result[i].error) {
                  response = result[i]
                }
              }
              if (response && response.error) {
                if (result.errorDescription) {
                  this.error = result.errorDescription
                } else {
                  this.loginError = 'Error occurred'
                  this.loginStep = 1
                  this.isChallengeUser = false
                  form.otp = ''
                  this.loginForm.controls['otp'].setValue('')
                  this.loginForm['otp'].setValidators([])
                }
              } else {
                if (mustAgree) {
                  this._router.navigate(['/terms-and-conditions'], {
                    queryParams: {
                      privilege: this.generalPrivilege,
                      url: this.returnUrl,
                      isLogin: true,
                    },
                  })
                  return
                }
                this._router.navigateByUrl(this.returnUrl)
              }
            })
          } else {
            form.otp = ''
            this.loginForm.controls['otp'].setValue('')
          }
        })
    } else if ((this.loginStep == 2 && this.isChallengeUser && this.activeTab == 1) ||
      (this.loginStep == 3 && this.isChallengeUser && this.activeTab == 2)) {
      if (!this.validateInput('response')) {
        return
      }
      this.authService
        .loginSoftToken(
          form.userId,
          form.companyId,
          form.password,
          this.challengeCode,
          form.response,
        )
        .subscribe((res) => {
          if (!res.error) {
            const currentUser = JSON.parse(
              this.storageService.retrieve('currentUser'),
            )

            const mustAgree = this.authService.mustSignTermsAndConditions(
              this.generalPrivilege,
            )
            const firstLogin: boolean = currentUser.user.firstLogin
            const hasChallengeQuestions: boolean =
              currentUser.hasChallengeQuestions
            const passwordExpired: boolean = currentUser.user.passwordExpired

            if (firstLogin || passwordExpired || !hasChallengeQuestions) {
              if (mustAgree) {
                this._router.navigate(['/terms-and-conditions'], {
                  queryParams: {
                    privilege: this.generalPrivilege,
                    url: '/change-password',
                    isLogin: true,
                  },
                })
              } else {
                this._router.navigateByUrl('/change-password')
              }
              return
            }
            this.authService.initateUser().subscribe((result) => {
              let response = null
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < result.length; i++) {
                if (result[i].error) {
                  response = result[i]
                }
              }
              if (response && response.error) {
                if (result.errorDescription) {
                  this.error = result.errorDescription
                } else {
                  this.loginError = 'Error occurred'
                  this.loginStep = 1
                  this.isChallengeUser = false
                  form.response = ''
                  this.loginForm.controls['response'].setValue('')
                  this.loginForm['response'].setValidators([])
                }
              } else {
                if (mustAgree) {
                  this._router.navigate(['/terms-and-conditions'], {
                    queryParams: {
                      privilege: this.generalPrivilege,
                      url: this.returnUrl,
                      isLogin: true,
                    },
                  })
                  return
                }
                this._router.navigateByUrl(this.returnUrl)
              }
            })
          } else {
            if (
              res.errorCode == -5 &&
              res.errorDescription == 'Max tries reached'
            ) {
              this.resetTokenShowLinkToReset = true
            }
            if (res.authentication && res.authentication.challengeCode) {
              this.challengeCode = res.authentication.challengeCode
            }
            form.response = ''
            this.loginForm.controls['response'].setValue('')
          }
        })
    } else {
      if (this.activeTab == 1 || (this.activeTab == 2) && this.loginStep == 2) {
        if (!this.validateInput('companyId')) {
          return
        }

        if (!this.validateInput('userId')) {
          return
        }


        if (!this.validateInput('password')) {
          return
        }
        this.authService
          .validUser(form.userId, form.companyId, form.password)
          .subscribe((res) => {
            this.loginStep++
            this.showOTP(res)
          })
      } else {
        if (!this.validateInput('civilianId')) {
          return
        }
        if (!this.validateInput('password')) {
          return
        }
        this.authService
          .validCivilianId(form.civilianId, form.password)
          .subscribe((res) => {
            if (!res.error) {
              this.companyList = res.companyList
              this.companyIds = this.fillcompanyList()
              if (this.companyIds.length == 1) {
                this.loginForm.controls['companyId'].patchValue(this.companyIds[0])
                this.companyChanged(this.companyIds[0])
              }
              this.isOneUser = this.userIds.length == 1 && this.companyIds.length == 1
              this.loginForm.controls['civilianId'].disable()
              this.loginForm.controls['password'].disable()
              this.loginForm.controls['companyId'].setValidators([Validators.required])
              this.loginForm.controls['userId'].setValidators([Validators.required])
              if (this.isOneUser) {
                this.loginStep = 3
                this.showOTP(res)
              } else {
                this.loginStep++
              }
            } else {
              this.loginError = res.errorDescription
            }
          })
      }
    }
  }

  showOTP(res: any) {
    if (res['otp']) {
      this.isChallengeUser = false
      this.loginForm.controls['userId'].disable()
      this.loginForm.controls['companyId'].disable()
      this.loginForm.controls['otp'].setValidators([
        Validators.required,
        Validators.pattern('[0123456789]*'),
        Validators.maxLength(6),
        Validators.minLength(4),
      ])
    } else if (res['softToken']) {
      this.isChallengeUser = true
      this.loginForm.controls['userId'].disable()
      this.loginForm.controls['companyId'].disable()
      this.challenge = res['challenge']
      this.loginForm.controls['response'].setValidators([
        Validators.required,
        Validators.pattern('[0123456789]*'),
        Validators.maxLength(6),
        Validators.minLength(4),
      ])
      this.challengeCode = this.challenge['challengeCode']
      this.serial = this.challenge['serial']
      this.isQr = !this.challenge['isNoQr']
    } else {
      this.loginStep = 1
      this.isChallengeUser = false
      if (res['errorCode'] !== 0) {
        if (
          res.errorCode == -5 &&
          res.errorDescription == 'Max tries reached'
        ) {
          this.resetTokenShowLinkToReset = true
        }
        this.error = res.errorDescription
        this.loginError = res.errorDescription
        this.loginForm.controls['otp'].setValue('')
        this.loginForm.controls['response'].setValue('')
        this.loginStep = 1
        if (this.activeTab == 2) {
          this.loginForm.controls['civilianId'].enable()
          this.loginForm.controls['password'].enable()
        }
      }
    }
  }

  companyChanged(companyProfile) {
    if (companyProfile != '' && companyProfile != null) {
      let company = this.companyList.filter(item => {
        return item.profileNumber == companyProfile
      })
      if (company.length > 0) {
        this.userIds = this.fillUserList(company[0].users)
        if (this.userIds.length == 1) {
          this.loginForm.controls['userId'].patchValue(this.userIds[0])
        } else {
          this.loginForm.controls['userId'].patchValue('')
        }
      } else {
        this.userIds = []
        this.loginForm.controls['userId'].patchValue('')
      }
    } else {
      this.userIds = []
      this.loginForm.controls['userId'].patchValue('')
    }
  }

  mask(item: string) {
    if (item) {
      return item.slice(0, -2)
          .replace(/./g, '*')
        + item.slice(-2)
    }
    return null
  }

  fillcompanyList() {
    let newList = []
    this.companyList.forEach((item) => {
      newList.push(item.profileNumber)
    })
    return newList
  }

  fillUserList(list) {
    let newList = []
    if (list) {
      list.forEach((item) => {
        newList.push(item.userId)
      })
    }
    return newList
  }

  private _clearForm() {
    this.loginForm.reset()
    this.loginStep = 1
    this.isChallengeUser = false
  }

  public closeMessageLogin() {
    this.messageActive = false
  }

  public validateInput(value: string): boolean {
    let error = true

    if ('companyId' === value) {
      this.loginForm.controls['companyId'].setValidators([
        Validators.required,
        Validators.pattern('[0123456789]*'),
        Validators.maxLength(10),
      ])
    }

    if ('otp' === value || 'response' === value) {
      this.loginForm.controls['otp'].setValidators([
        Validators.pattern('[0123456789]*'),
        Validators.maxLength(6),
        Validators.minLength(4),
      ])
      this.loginForm.controls['response'].setValidators([
        Validators.pattern('[0123456789]*'),
        Validators.maxLength(6),
        Validators.minLength(4),
      ])
      this.loginForm.controls[value].setValidators([
        Validators.required,
        Validators.pattern('[0123456789]*'),
        Validators.maxLength(6),
        Validators.minLength(4),
      ])
    }
    this.loginError = ''

    if (this.loginForm.controls[value].errors) {
      this.translate
        .get('login.messageErrors.' + value)
        .subscribe((res: string) => {
          this.loginError = res
        })
      error = false
    } else {
      this.loginError = ''
    }
    return error
  }

  openFooterLink(event, url) {
    event.preventDefault()
    const url_to_open = this._config.getDocumentUrl() + url +
      this.translate.currentLang +
      '.pdf'
    window.open(url_to_open, '_blank')
  }

  openMessageLink(event, url, pk) {
    event.preventDefault()
    this.authService.putClickMessage(pk)

    const url_to_open = url
    window.open(url_to_open, '_blank')
  }

  openHelpLink() {
    window.open(this._config.getDocumentUrl() + '/AlRajhi_Business_FAQ_V2.4_' + this.translate.currentLang + '.pdf')
  }

  // method that initializes the form as at the beginning
  public initializeForm(form: any) {
    this.loginStep = 1
    this.loginForm.controls['password'].setValue('')
    this.loginForm.controls['response'].setValue('')
    this.loginForm.controls['userId'].setValue('')
    this.loginForm.controls['companyId'].setValue('')

    this.loginForm.controls['userId'].enable()
    this.loginForm.controls['companyId'].enable()
    this.loginForm.controls['otp'].enable()
  }

  // Logout method
  logout() {
    this.storageService.clearAll()
    this._router.navigate(['login'])
  }

  getSanitizedUnescapedStr(str) {
    const txt = document.createElement('textarea')
    txt.innerHTML = unescape(str)
    return this._sanitizer.bypassSecurityTrustHtml(txt.value)
  }

  isEmpty(str) {
    return (
      !str ||
      (Array.isArray(str) && str.length == 0) ||
      Object.keys(str).length == 0
    )
  }

  //--------------------------------------------------

  public recalculateChallengeQuestions() {
    this.challengeQuestionsSelectedOptions =
      this.getTwoRandomOptionsForChallengeQuestions(
        this.challengeQuestionsTotal,
      )
  }

  public getTwoRandomOptionsForChallengeQuestions(maxValue: number): any[] {
    let value1 = Math.floor(Math.random() * Math.floor(maxValue)) % maxValue
    let value2 = Math.floor(Math.random() * Math.floor(maxValue)) % maxValue
    if (value1 == value2) {
      value2 = (value1 + 1) % maxValue
    }
    if (value1 > value2) {
      const temp = value1
      value1 = value2
      value2 = temp
    }
    return [value1 + 1, value2 + 1]
  }

  public resetUserLoginForm() {
    this.loginForm.get('password').setValue('')
    this.loginForm
      .get('password')
      .setValidators([
        Validators.required,
        Validators.pattern(
          '[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]*',
        ),
      ])
    this.loginForm.controls['companyId'].enable()
    this.loginForm.controls['userId'].enable()
    this.loginForm.controls['password'].enable()

    this.loginForm.reset()

    this.loginForm.get('companyId').setValue('')
    this.loginForm.get('userId').setValue('')
    this.loginForm.get('password').setValue('')

    this.loginForm.controls['otp'].setValidators([
      Validators.pattern('[0123456789]*'),
      Validators.maxLength(6),
      Validators.minLength(4),
    ])
    this.loginForm.controls['response'].setValidators([
      Validators.pattern('[0123456789]*'),
      Validators.maxLength(6),
      Validators.minLength(4),
    ])
    this.loginForm.get('otp').setValue('')
    this.loginForm.get('response').setValue('')
  }

  public resetUserLoginFormPersisted() {
    this.loginForm
      .get('password')
      .setValidators([
        Validators.required,
        Validators.pattern(
          '[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]*',
        ),
      ])
    this.loginForm.controls['companyId'].enable()
    this.loginForm.controls['userId'].enable()
    this.loginForm.controls['password'].enable()


    this.loginForm.controls['otp'].setValidators([
      Validators.pattern('[0123456789]*'),
      Validators.maxLength(6),
      Validators.minLength(4),
    ])
    this.loginForm.controls['response'].setValidators([
      Validators.pattern('[0123456789]*'),
      Validators.maxLength(6),
      Validators.minLength(4),
    ])
    this.loginForm.get('otp').setValue('')
    this.loginForm.get('response').setValue('')
  }

  //--------------------------------------------------

  public resetPasswordBeginProcess() {
    this.resetPasswordIsActivated = true
    this.loginError = null
    this.resetPasswordStep = 1
    this.loginForm.get('password').setValidators([])
    this.loginForm.get('password').setValue('---')
    this.recalculateChallengeQuestions()
    this.resetPasswordModal.show()
    this.resetTokenModal.config.backdrop = 'static'
  }

  public resetPasswordEndProcess() {
    this.resetPasswordIsActivated = false
    this.loginError = null

    // ---------------------------

    //this.loginForm = this.getInitialLoginForm();

    if (!this.isCallReceived) {
      this.resetUserLoginForm()
    }

    this.resetUserLoginFormPersisted()

    // ---------------------------

    this.loginStep = 1
    this.resetPasswordStep = 1
    this.resetPasswordForm.reset()
    this.resetPasswordModal.hide()
    this.resetPasswordModal.hide()
  }

  public resetPasswordCloseModal(): void {
    this.backStep1()

    const userId = this.loginForm.controls['userId'].value
    const companyId = this.loginForm.controls['companyId'].value

    this.loginForm.controls['userId'].patchValue(this.isCallReceived ? userId : '')
    this.loginForm.controls['companyId'].patchValue(this.isCallReceived ? companyId : '')

    this.resetPasswordForm.reset()
    this.resetPasswordModal.hide()
    this.isIVR = false

    this.resetPasswordEndProcess()
  }

  public resetPasswordCheckIsEqualPass(): boolean {
    if (
      this.resetPasswordForm.controls['newPasswordConfirm'].value &&
      this.resetPasswordForm.controls['newPassword'].value
    ) {
      if (
        this.resetPasswordForm.controls['newPasswordConfirm'].value ==
        this.resetPasswordForm.controls['newPassword'].value
      ) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  public resetPasswordBackStep() {
    this.resetPasswordStep--
    if (this.resetPasswordStep == 0 || this.resetPasswordStep == 1) {
      this.resetPasswordStep = 1
      const userId = this.loginForm.controls['userId'].value
      const companyId = this.loginForm.controls['companyId'].value
      //const password = this.loginForm.controls["password"].value;
      this.resetPasswordEndProcess()
      this.resetPasswordBeginProcess()
      this.loginForm.controls['userId'].setValue(userId)
      this.loginForm.controls['companyId'].setValue(companyId)
      //this.loginForm.controls["password"].setValue(password);
    }
  }

  public resetPasswordClearChallengeAnswers(): void {
    this.resetPasswordFormData.question1 = ''
    this.resetPasswordFormData.question2 = ''
    this.resetPasswordFormData.question3 = ''
    this.resetPasswordFormData.question4 = ''
  }

  public resetPasswordStep1IdentifyUser() {
    const formData = {
      companyId: this.loginForm.get('companyId').value,
      userId: this.loginForm.get('userId').value,
    }
    this.resetPasswordStep = 1

    this.recalculateChallengeQuestions()

    this.resetPasswordClearChallengeAnswers()

    if (!this.validateInput('companyId')) {
      return
    }
    if (!this.validateInput('userId')) {
      return
    }

    this.resetPasswordModalZIndex = 1000
    this.subscriptions.push(
      this.authService
        .validUserGetSecondAuthenticationMethod(
          formData.userId,
          formData.companyId,
        )
        .subscribe((result) => {
          this.resetPasswordModalZIndex = 1049
          this.resetPasswordAuthData = result
          if (result['otp']) {
            this.loginStep = 2
            this.isChallengeUser = false
            this.loginForm.controls['userId'].disable()
            this.loginForm.controls['companyId'].disable()
            this.loginForm.controls['otp'].setValidators([
              Validators.required,
              Validators.pattern('[0123456789]*'),
              Validators.maxLength(6),
              Validators.minLength(4),
            ])
          } else if (result['softToken']) {
            this.loginStep = 2
            this.isChallengeUser = true
            this.loginForm.controls['userId'].disable()
            this.loginForm.controls['companyId'].disable()
            this.challenge = result['challenge']
            this.loginForm.controls['response'].setValidators([
              Validators.required,
              Validators.pattern('[0123456789]*'),
              Validators.maxLength(6),
              Validators.minLength(4),
            ])
            this.challengeCode = this.challenge['challengeCode']
            this.serial = this.challenge['serial']
            this.isQr = !this.challenge['isNoQr']
          } else {
            this.loginStep = 1
            this.isChallengeUser = false
            if (result['errorCode'] !== 0) {
              this.error = result.errorDescription
              this.loginError = result.errorDescription
              formData['otp'] = ''
              formData['response'] = ''
              this.loginStep = 1
            }
          }
        }),
    )
  }

  public resetPasswordStep1AuthenticateUser() {
    const form = this.loginForm.getRawValue()

    let login = false
    if (!this.isChallengeUser) {
      if (!this.validateInput('otp')) {
        return
      }
      login = true
      this.resetPasswordModalZIndex = 1000
      this.subscriptions.push(
        this.authService
          .obtainChallengeQuestionsOTP(form.userId, form.companyId, form.otp)
          .subscribe((result) => {
            this.resetPasswordModalZIndex = 1049
            if (!result.error) {
              const token = result.token
              this.storageService.store(
                'currentUser',
                JSON.stringify({
                  token,
                }),
              )
              this.resetPasswordStep = 2
            } else {
              // this.initializeForm(form)
              this.error = result.errorDescription
              this.loginError = result.errorDescription
              form.otp = ''
              form.response = ''
              this.loginForm.controls['otp'].setValue('')
              this.loginForm.controls['response'].setValue('')
            }
          }),
      )
    }

    // --------------------------------

    if (this.isChallengeUser) {
      if (!this.validateInput('response')) {
        return
      }
      this.resetPasswordModalZIndex = 1000
      this.subscriptions.push(
        this.authService
          .obtainChallengeQuestionsToken(
            form.userId,
            form.companyId,
            this.challengeCode,
            form.response,
          )
          .subscribe((result) => {
            this.resetPasswordModalZIndex = 1049
            if (!result.error) {
              const token = result.token
              this.storageService.store(
                'currentUser',
                JSON.stringify({
                  token,
                }),
              )
              this.resetPasswordStep = 2
            } else {
              // this.initializeForm(form)
              this.error = result.errorDescription
              this.loginError = result.errorDescription
              form.otp = ''
              form.response = ''
              this.loginForm.controls['otp'].setValue('')
              this.loginForm.controls['response'].setValue('')
            }
          }),
      )
    }
  }

  public resetPasswordStep2ValidateUserChallengeResponses() {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const token = currentUser && currentUser.token ? currentUser.token : null

    const questionFormData = Object.assign(
      {},
      this.resetPasswordForm.getRawValue(),
      this.loginForm.getRawValue(),
    )

    this.resetPasswordModalZIndex = 1000
    this.subscriptions.push(
      this.authService
        .validateChallengeAnswers(
          questionFormData,
          token,
          this.challengeQuestionsTotal,
          true,
        )
        .subscribe((result) => {
          this.resetPasswordModalZIndex = 1049
          if (result.error) {
            //this.resetPasswordForm.reset()
            //this.resetPasswordModal.hide()
            //this.loginForm.reset()
            //this.deActiveResetPassword();
            //this.backStep1()
            //this.storageService.clearAll()
          } else {
            //this.resetPasswordModal.hide()
            this.resetPasswordStep = 3
          }
        }),
    )
  }

  public resetPasswordStep3ConfirmResetPassword() {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const token = currentUser && currentUser.token ? currentUser.token : null

    let questionForm = {}
    if (!this.isIVR) {
      questionForm = Object.assign(
        {},
        this.resetPasswordForm.getRawValue(),
        this.loginForm.getRawValue(),
        {
          authData: this.resetPasswordAuthData,
        },
      )
    }

    this.resetPasswordModalZIndex = 1000
    this.subscriptions.push(
      this.authService
        .confirmChallengeAnswersAndNewPassword(
          questionForm,
          token,
          this.challengeQuestionsTotal,
          true,
        )
        .subscribe((result) => {
          this.resetPasswordModalZIndex = 1049
          if (result.error) {
          } else {
            this.error = null
            this.error = result.errorDescription
            this.resetPasswordForm.reset()
            this.resetPasswordModal.hide()
            this.authService.initateUser().subscribe((result2) => {
              let response = null
              for (let i = 0; i < result2.length; i++) {
                if (result2[i].error) {
                  response = result2[i]
                }
              }
              if (response && response.error) {
                this.logout()
              } else {
                this._router.navigate([''])
              }
            })
          }
        }),
    )
  }

  // ----------------------------------------------------------

  public resetTokenInitProcess() {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const token = currentUser && currentUser.token ? currentUser.token : null

    const questionFormData = Object.assign(
      {},
      this.resetTokenForm.getRawValue(),
      this.loginForm.getRawValue(),
    )

    this.subscriptions.push(
      this.authService
        .validateInitResetToken(
          questionFormData,
          token,
          this.challengeQuestionsTotal,
          false,
        )
        .subscribe((result) => {
          if (result.error) {
            //this.resetTokenForm.reset()
            //this.resetTokenModal.hide()
            //this.loginForm.reset()
            //this.deActiveResetToken();
            //this.backStep1()
            //this.storageService.clearAll()
          } else {
            this.resetTokenBeginProcess()
          }
        }),
    )
  }

  public resetTokenBeginProcess() {
    this.loginError = null
    this.resetTokenStep = 1
    //this.loginForm.get('password').setValidators([]);
    //this.loginForm.get('password').setValue('---');
    this.loginForm.get('companyId').disable()
    this.loginForm.get('userId').disable()
    this.loginForm.get('password').disable()

    this.resetTokenForm.controls['challengeNumber'].setValidators([
      Validators.required,
      Validators.pattern('[0123456789]*'),
      Validators.minLength(4),
      Validators.maxLength(8),
    ])

    this.recalculateChallengeQuestions()
    this.resetTokenModal.show()
  }

  public resetTokenEndProcess() {
    this.resetTokenShowLinkToReset = false

    this.loginError = null

    // ---------------------------

    //this.loginForm = this.getInitialLoginForm();

    this.resetUserLoginForm()

    // ---------------------------

    this.loginStep = 1
    this.resetTokenStep = 0
    this.resetTokenForm.reset()
    this.resetTokenModal.hide()
  }

  public resetTokenCloseModal(): void {
    //const form = this.loginForm.getRawValue()
    this.backStep1()

    this.loginForm.controls['userId'].setValue('')
    this.loginForm.controls['companyId'].setValue('')
    this.loginForm.controls['password'].setValue('')

    this.resetTokenForm.reset()
    this.resetTokenModal.hide()

    this.resetTokenEndProcess()
  }

  public resetTokenBackStep() {
    this.resetTokenStep--
    if (this.resetTokenStep == 0 || this.resetTokenStep == 1) {
      this.resetTokenStep = 1

      const userId = this.loginForm.controls['userId'].value
      const companyId = this.loginForm.controls['companyId'].value
      const password = this.loginForm.controls['password'].value

      this.resetTokenEndProcess()
      this.resetTokenBeginProcess()

      this.loginForm.controls['userId'].setValue(userId)
      this.loginForm.controls['companyId'].setValue(companyId)
      this.loginForm.controls['password'].setValue(password)
    }
  }

  public resetTokenStep1ValidateUserChallengeResponses() {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const token = currentUser && currentUser.token ? currentUser.token : null

    const questionFormData = Object.assign(
      {},
      this.resetTokenForm.getRawValue(),
      this.loginForm.getRawValue(),
    )

    this.resetTokenModalZIndex = 1000
    this.subscriptions.push(
      this.authService
        .validateChallengeAnswers(
          questionFormData,
          token,
          this.challengeQuestionsTotal,
          false,
        )
        .subscribe((result) => {
          this.resetTokenModalZIndex = 1049
          if (result.error) {
            //this.resetTokenForm.reset()
            //this.resetTokenModal.hide()
            //this.loginForm.reset()
            //this.deActiveResetToken();
            //this.backStep1()
            //this.storageService.clearAll()
          } else {
            //this.resetTokenModal.hide()
            this.resetTokenStep = 2
            this.resetTokenStep2IdentifyUser()
          }
        }),
    )
  }

  public resetTokenStep2IdentifyUser() {
    const formData = {
      companyId: this.loginForm.get('companyId').value,
      userId: this.loginForm.get('userId').value,
      password: this.loginForm.get('password').value,
    }
    this.resetTokenStep = 2

    if (!this.validateInput('companyId')) {
      return
    }
    if (!this.validateInput('userId')) {
      return
    }

    this.resetTokenModalZIndex = 1000
    this.subscriptions.push(
      this.authService
        .validUserForceOTPMethod(
          formData.userId,
          formData.companyId,
          formData.password,
        )
        .subscribe((result) => {
          this.resetTokenModalZIndex = 1049
          this.resetTokenAuthData = result
          this.resetTokenIsSoftToken =
            result && result.softToken ? result.softToken : false
          if (result['otp']) {
            this.loginStep = 2
            this.isChallengeUser = false
            this.loginForm.controls['userId'].disable()
            this.loginForm.controls['companyId'].disable()
            this.loginForm.controls['otp'].setValidators([
              Validators.required,
              Validators.pattern('[0123456789]*'),
              Validators.maxLength(6),
              Validators.minLength(4),
            ])
          } else if (result['softToken']) {
            this.loginStep = 2
            this.isChallengeUser = true
            this.loginForm.controls['userId'].disable()
            this.loginForm.controls['companyId'].disable()
            this.challenge = result['challenge']
            this.loginForm.controls['response'].setValidators([
              Validators.required,
              Validators.pattern('[0123456789]*'),
              Validators.maxLength(6),
              Validators.minLength(4),
            ])
            this.challengeCode = this.challenge['challengeCode']
            this.serial = this.challenge['serial']
            this.isQr = !this.challenge['isNoQr']
          } else {
            this.loginStep = 1
            this.isChallengeUser = false
            if (result['errorCode'] !== 0) {
              this.error = result.errorDescription
              this.loginError = result.errorDescription
              formData['otp'] = ''
              formData['response'] = ''
              this.loginStep = 1
            }
          }
        }),
    )
  }

  public resetTokenStep2AuthenticateUser() {
    const form = this.loginForm.getRawValue()

    let login = false
    if (!this.isChallengeUser) {
      if (!this.validateInput('otp')) {
        return
      }
      login = true
      this.resetTokenModalZIndex = 1000
      this.subscriptions.push(
        this.authService
          .obtainChallengeQuestionsOTP(form.userId, form.companyId, form.otp)
          .subscribe((result) => {
            this.resetTokenModalZIndex = 1049
            if (!result.error) {
              const token = result.token
              this.storageService.store(
                'currentUser',
                JSON.stringify({
                  token,
                }),
              )
              this.resetTokenStep = 3
            } else {
              // this.initializeForm(form)
              this.error = result.errorDescription
              this.loginError = result.errorDescription
              //form.otp = ''
              //form.response = ''
              this.loginForm.controls['otp'].setValue('')
              this.loginForm.controls['response'].setValue('')
            }
          }),
      )
    }

    // --------------------------------

    if (this.isChallengeUser) {
      if (!this.validateInput('response')) {
        return
      }
      this.resetTokenModalZIndex = 1000
      this.subscriptions.push(
        this.authService
          .obtainChallengeQuestionsToken(
            form.userId,
            form.companyId,
            this.challengeCode,
            form.response,
          )
          .subscribe((result) => {
            this.resetTokenModalZIndex = 1049
            if (!result.error) {
              const token = result.token
              this.storageService.store(
                'currentUser',
                JSON.stringify({
                  token,
                }),
              )
              this.resetTokenStep = 3
            } else {
              // this.initializeForm(form)
              this.error = result.errorDescription
              this.loginError = result.errorDescription
              //form.otp = ''
              //form.response = ''
              this.loginForm.controls['otp'].setValue('')
              this.loginForm.controls['response'].setValue('')
            }
          }),
      )
    }
  }

  public resetTokenStep3ConfirmResetToken() {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const token = currentUser && currentUser.token ? currentUser.token : null

    const questionForm = Object.assign(
      {},
      this.resetTokenForm.getRawValue(),
      this.loginForm.getRawValue(),
      {
        authData: this.resetTokenAuthData,
      },
    )

    this.resetTokenModalZIndex = 1000
    this.subscriptions.push(
      this.authService
        .confirmChallengeAnswersAndNewToken(
          questionForm,
          token,
          this.challengeQuestionsTotal,
        )
        .subscribe((result) => {
          this.resetTokenModalZIndex = 1049
          //console.log(result);
          if (result.error) {
            //this.resetTokenForm.get('newPassword').setValue('')
            //this.resetTokenForm.get('newPasswordConfirm').setValue('')
            //this.resetTokenForm.reset()
            //this.resetTokenForm.hide()
            //this.loginForm.reset()
            //this.deActiveResetToken();
            //this.backStep1()
            //this.storageService.clearAll()
          } else {
            this.error = null
            this.error = result.errorDescription
            // this.resetTokenForm.reset()
            // this.resetTokenModal.hide()
            this.resetTokenEndProcess()
            /*
                                            this.authService.initateUser().subscribe((result2) => {
                                                let response = null
                                                // tslint:disable-next-line:prefer-for-of
                                                for (let i = 0; i < result2.length; i++) {
                                                    if (result2[i].error) {
                                                        response = result2[i]
                                                    }
                                                }
                                                if (response && response.error) {
                                                    this.logout()
                                                } else {
                                                    this._router.navigate([''])
                                                }
                                            })
                                             */
          }
        }),
    )
  }

  public showTitleLang(): string {
    return this.translate.currentLang === 'en'
      ? 'login-label-form'
      : 'login-label-form-ar'
  }

  public languageLocationClass(): string {
    if (this.translate.currentLang === 'en') {
      if (this.loginStep === 1) {
        return 'container-login__language-en'
      } else {
        return 'container-login__language-en-step2'
      }
    } else {
      if (this.loginStep === 1) {
        return 'container-login__language-ar'
      } else {
        return 'container-login__language-ar-step2'
      }
    }
  }

  public goToAgreementsLink(): void {
    if (this.translate.currentLang === 'en') {
      window.open(
        'https://eservice.alrajhibank.com.sa/business-eRegistration/en',
      )
    } else {
      window.open(
        'https://eservice.alrajhibank.com.sa/business-eRegistration/ar',
      )
    }
  }

  public openAccountCloseModal(): void {
    this.openAccountModal.hide()
  }

  public showOpenAccount(): void {
    this.openAccountModal.show()
  }

  public goToOpenAccount(): void {
    if (this.isSolo == 1 || this.isSolo == 2 || this.isSolo ==4) {
      if (this.translate.currentLang === 'en') {
        window.open(
          'https://eservice.alrajhibank.com.sa/business-accountopening/?lang=en',
        )
      } else {
        window.open(
          'https://eservice.alrajhibank.com.sa/business-accountopening/?lang=ar',
        )
      }
    } else {
      if (this.translate.currentLang === 'en') {
        window.open(
          ' https://www.alrajhibank.com.sa/en/corporate/opencurrentaccountcorporate',
        )
      } else {
        window.open(
          ' https://www.alrajhibank.com.sa/ar/corporate/opencurrentaccountcorporate',
        )
      }

    }
    this.openAccountModal.hide()
  }


  public show() {
    console.log(this.loginForm)
  }

  forgetQuestions() {
    const form = this.loginForm.getRawValue()
    this.authService
      .forgotQuestions(form.userId, form.companyId)
      .subscribe((res) => {
        if (res.errorCode == '0') {
          this.generateChallengeAndOTP = res.generateChallengeAndOTP
          this.isIVR = true
          this.resetPasswordStep = 3
        }
      })
  }

  removeIVR() {
    this.isIVR = false
  }

  callRecived() {
    this.isCallReceived = true
    this.resetPasswordCloseModal()
  }

  onIVR_TimerFinish() {
    this.showRecall = true
  }

  reCall() {
    this.forgetQuestions()
  }

  setActiveTab(tab) {
    this.loginStep = 1
    this.activeTab = tab
    this.loginForm = this.getInitialLoginForm(tab)
  }

  isActiveTab(tab) {
    return this.activeTab == tab
  }

  modifyDetails() {
    window.open('https://eservice.alrajhibank.com.sa/Business/UpdateSoleInformation/', '_blank')
  }
}
