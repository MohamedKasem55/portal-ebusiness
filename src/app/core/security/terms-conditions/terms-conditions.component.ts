import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../storage/storage.service'
import { AuthenticationService } from '../authentication.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'terms-conditions',
  templateUrl: './terms-conditions.component.html',
})
export class TermsConditionsComponent implements OnInit, OnDestroy {
  showChangePassword: boolean
  loading: boolean
  error: string
  userLogged: boolean
  public firstLogin: boolean
  public passwordExpired = false
  public hasChallengeQuestions: boolean
  public formData: any = {}
  public translate: any
  public firstAnswer: string
  public secondAnswer: string
  public thirdAnswer: string
  public fourthAnswer: string
  public changePassword: Subscription
  public changePasswordAndQuestions: Subscription
  public registerChallengeQuestions: Subscription
  public cp: string
  public op: string
  public np: string

  constructor(
    private injector: Injector,
    public router: Router,
    private storageService: StorageService,
    public authenticationService: AuthenticationService,
  ) {
    this.showChangePassword = false
    this.loading = false
    this.error = null
    this.userLogged = this.authenticationService.userLogged()
    if (this.userLogged) {
      const currentUser = JSON.parse(
        this.storageService.retrieve('currentUser'),
      )
      this.firstLogin = currentUser.user.firstLogin
      this.hasChallengeQuestions = currentUser.hasChallengeQuestions
      this.passwordExpired = currentUser.user.passwordExpired

      if (!this.firstLogin) {
        this.router.navigate([''])
      }
      this.showChangePassword = true
    }
  }

  valid() {
    const mobilePattern = /(\(9665|05|[0-9]{1,4})[0-9]{8,8}$/
    const shortTextPattern = /^[a-zA-Z0-9\u0600-\u06FF ]{3,25}$/
    const longTextPattern = /^[a-zA-Z0-9\u0600-\u06FF ]{4,50}$/
    let firstQuestion = this.formData.firstQuestion
    let secondQuestion = this.formData.secondQuestion
    let thirdQuestion = this.formData.thirdQuestion
    let fourthQuestion = this.formData.fourthQuestion
    if (firstQuestion === undefined) {
      firstQuestion = ''
    }
    if (secondQuestion === undefined) {
      secondQuestion = ''
    }
    if (thirdQuestion === undefined) {
      thirdQuestion = ''
    }
    if (fourthQuestion === undefined) {
      fourthQuestion = ''
    }
    return !(
      firstQuestion != '' &&
      firstQuestion != null &&
      longTextPattern.test(firstQuestion) &&
      secondQuestion != '' &&
      secondQuestion != null &&
      longTextPattern.test(secondQuestion) &&
      thirdQuestion != '' &&
      thirdQuestion != null &&
      shortTextPattern.test(thirdQuestion) &&
      fourthQuestion != '' &&
      fourthQuestion != null &&
      mobilePattern.test(fourthQuestion) &&
          !this.isDuplicateAnswers()
    )
  }

  validPass() {
    let cp1 = this.formData.newPasswordConfirm
    let op1 = this.formData.oldPassword
    let np1 = this.formData.newPassword
    if (cp1 === undefined) {
      cp1 = ''
    }
    if (op1 === undefined) {
      op1 = ''
    }
    if (np1 === undefined) {
      np1 = ''
    }
    const notArabicPattern =
      /[^\u0600-\u06ff\u0750-\u077f\ufb50-\ufc3f\ufe70-\ufefc]$/
    return !(
      cp1 != '' &&
      cp1 != null &&
      notArabicPattern.test(cp1) &&
      op1 != '' &&
      op1 != null &&
      notArabicPattern.test(op1) &&
      np1 != '' &&
      np1 != null &&
      notArabicPattern.test(np1)
    )
  }

  disabledButton() {
    // this is in case the user don't have questions
    return !(!this.valid() && !this.validPass() && this.isEqualPass() )
  }
  disabledButtonQuestion() {
    // this is in case the user already have questions
    if (!this.validPass() && this.isEqualPass() && this.isDuplicateAnswers()) {
      return false
    }
    return true
  }

  // method that changes the old password for the new one
  doChangePassword(cp, np) {
    if ((cp == null && np == null) || !(np.invalid || cp.invalid)) {
      this.changePassword = this.authenticationService
        .doChangePassword(this.formData.oldPassword, this.formData.newPassword)
        .subscribe((result) => {
          //
          if (result.error) {
            this.error = result.errorDescription
            this.loading = false
          } else {
            this.error = null

            const currentUser = JSON.parse(
              this.storageService.retrieve('currentUser'),
            )
            currentUser.user.firstLogin = false
            currentUser.user.passwordExpired = false
            this.storageService.store(
              'currentUser',
              JSON.stringify(currentUser),
            )
            this.authenticationService.initateUser().subscribe((result2) => {
              let response = null
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < result2.length; i++) {
                if (result2[i].error) {
                  response = result2[i]
                }
              }
              if (response && response.error) {
                this.logout()
                this.loading = false
                this.showChangePassword = false
              } else {
                this.router.navigate([''])
              }
            })
          }
          this.changePassword.unsubscribe()
        })
    }
  }

  logout() {
    this.storageService.clearAll()
    this.router.navigate(['login'])
  }

  ngOnInit() {
    if (this.firstAnswer) {
      this.formData.firstQuestion = this.firstAnswer
      this.formData.secondQuestion = this.secondAnswer
      this.formData.thirdQuestion = this.thirdAnswer
      this.formData.fourthQuestion = this.fourthAnswer
    }
    this.translate = this.injector.get(TranslateService)
    //const storageService = this.injector.get(StorageService);
    const lang = this.storageService.retrieve('currentLanguage')
    if (!this.translate.currentLang && lang != null) {
      this.translate.use(this.storageService.retrieve('currentLanguage'))
    } else if (!this.translate.currentLang) {
      this.translate.use('ar')
    }
    this.translate.reloadLang(this.translate.currentLang)
  }

  ngOnDestroy() {}

  changeEnglish() {
    this.translate.use('en').subscribe((result) => {
      //  const storageService = this.injector.get(StorageService);
      this.storageService.store('currentLanguage', 'en')
      //const _router = this.injector.get(Router);
      this.router.navigateByUrl(this.router.url)
    })
  }

  changeArabic() {
    this.translate.use('ar').subscribe((result) => {
      //   const storageService = this.injector.get(StorageService);
      this.storageService.store('currentLanguage', 'ar')
      //const _router = this.injector.get(Router);
      this.router.navigateByUrl(this.router.url)
    })
  }

  public doRegisterChallengeQuestions(
    firstQuestion: any,
    secondQuestion: any,
    thirdQuestion: any,
    fourthQuestion: any,
  ) {
    if (
      (firstQuestion == null &&
        secondQuestion == null &&
        thirdQuestion == null &&
        fourthQuestion == null) ||
      !(
        firstQuestion.invalid ||
        secondQuestion.invalid ||
        thirdQuestion.invalid ||
        fourthQuestion.invalid
      )
    ) {
      this.registerChallengeQuestions = this.authenticationService
        .registerChallengeQuestions(this.formData)
        .subscribe((result) => {
          if (result.error) {
            this.error = result.errorDescription
            this.loading = false
          } else {
            this.error = null

            /*const currentUser = JSON.parse(
                            this.storageService.retrieve('currentUser'),
                        )
                        currentUser.user.firstLogin = false
                        currentUser.user.passwordExpired = false
                        this.storageService.store(
                            'currentUser',
                            JSON.stringify(currentUser),
                        )*/
            this.authenticationService.initateUser().subscribe((result2) => {
              let response = null
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < result2.length; i++) {
                if (result2[i].error) {
                  response = result2[i]
                }
              }
              if (response && response.error) {
                this.logout()
                this.loading = false
                this.showChangePassword = false
              } else {
                this.router.navigate([''])
              }
            })
          }
          this.registerChallengeQuestions.unsubscribe()
        })
    }
  }

  // method that calls services to store questions and passwords updated by the user
  public doCompleteChange(
    op: any,
    cp: any,
    np: any,
    firstQuestion: any,
    secondQuestion: any,
    thirdQuestion: any,
    fourthQuestion: any,
  ): void {
    if (
      (firstQuestion == null &&
        secondQuestion == null &&
        thirdQuestion == null &&
        fourthQuestion == null &&
        op == null &&
        cp == null &&
        np == null) ||
      !(
        firstQuestion.invalid ||
        secondQuestion.invalid ||
        thirdQuestion.invalid ||
        fourthQuestion.invalid ||
        cp.invalid ||
        op.invalid ||
        np.invalid
      )
    ) {
      this.registerChallengeQuestions = this.authenticationService
        .registerPasswordChallengeQuestions(
          this.formData,
          this.formData.oldPassword,
          this.formData.newPassword,
        )
        .subscribe((result) => {
          if (result.error) {
            this.error = result.errorDescription
            this.loading = false
          } else {
            this.error = null
            const currentUser = JSON.parse(
              this.storageService.retrieve('currentUser'),
            )
            currentUser.user.firstLogin = false
            currentUser.user.passwordExpired = false
            this.storageService.store(
              'currentUser',
              JSON.stringify(currentUser),
            )
            this.authenticationService.initateUser().subscribe((result2) => {
              let response = null
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < result2.length; i++) {
                if (result2[i].error) {
                  response = result2[i]
                }
              }
              if (response && response.error) {
                this.logout()
                this.loading = false
                this.showChangePassword = false
              } else {
                this.router.navigate([''])
              }
            })
          }
          this.changePassword.unsubscribe()
        })
    }
  }

  // Validate password and new Password are equals

  isEqualPass(): boolean {
    if (this.formData.newPassword && this.formData.newPasswordConfirm) {
      if (this.formData.newPassword == this.formData.newPasswordConfirm) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  public isDuplicateAnswers(): boolean {
    if (this.hasChallengeQuestions){
      return true
    }
    const firstQ = this.formData.firstQuestion;
    const secondQ = this.formData.secondQuestion;
    const thirdQ = this.formData.thirdQuestion;
    const fourthQ = this.formData.fourthQuestion;

    if(firstQ && secondQ && thirdQ && fourthQ){

      if( (firstQ === secondQ || firstQ === thirdQ || firstQ === fourthQ)
          || (secondQ === thirdQ || secondQ === fourthQ)
          || (thirdQ === fourthQ)){

        return true
      }
    }
    return false
  }

  public isValidLongPattern(answer) : boolean {
    const longTextPattern = /^[a-zA-Z0-9\u0600-\u06FF ]{4,50}$/
    return longTextPattern.test(answer);
  }

  public isValidShortPattern(answer) : boolean {
    const shortTextPattern = /^[a-zA-Z0-9\u0600-\u06FF ]{3,25}$/
    return shortTextPattern.test(answer);
  }

  // issue ARBCORP4-2694, updated to not allow +
  getMobileNumberValidatorPattern() {
    // return '(\\+9665|05|[+]*[0-9]{1,4})[0-9]{8,8}$'
    return '(\\(9665|05|[0-9]{1,4})[0-9]{8,8}$'
  }

  getMobileNumberFormatPattern() {
    // return '05xxxxxxxx/+9665xxxxxxxx/+xxxxxxxxx';
    return '05xxxxxxxx/9665xxxxxxxx/xxxxxxxxx'
  }

  getMobileNumberTextPattern() {
    // return '05xxxxxxxx,+9665xxxxxxxx or +xxxxxxxxx';
    return '05xxxxxxxx,9665xxxxxxxx or xxxxxxxxx'
  }
}
