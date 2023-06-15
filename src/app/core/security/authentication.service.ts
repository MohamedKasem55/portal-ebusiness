import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { forkJoin, Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Company } from '../../Application/Model/company'
import { Dictionary } from '../../Application/Model/dictionary'
import { Parameter } from '../../Application/Model/parameter.interface'
import { User } from '../../Application/Model/user'
import { ConfigResourceService } from '../config/config.resource.local'
import { CryptoService } from '../crypto/crypto.service'
import { LogService } from '../log/log.service'
import { StorageService } from '../storage/storage.service'
import { Router } from '@angular/router'
import { SimpleMQ } from 'ng2-simple-mq'
export class ChallengeList {
  questionId: number
  questionIdStr: string
  questionValue: string
}

// tslint:disable-next-line:max-classes-per-file
export class LoginResponse {
  errorCode: any
  errorDescription: any
}

// tslint:disable-next-line:max-classes-per-file
@Injectable()
export class AuthenticationService {
  private servicesUrl: string
  private renewSessionInterval: any

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public storageService: StorageService,
    public translate: TranslateService,
    private logService: LogService,
    private cryptoService: CryptoService,
    private _router: Router,
    private smq: SimpleMQ,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    // console.error(errMsg)
    const errorService = {
      error: true,
      errorDescription: errMsg,
    }
    return of(errorService)
  }

  public initateUser(): Observable<any> {
    const observables = []
    observables.push(this.loadAccounts())
    observables.push(this.loadMenu())
    observables.push(this.loadWelcome())
    observables.push(this._loadServerParameters())
    return forkJoin(observables)
  }

  private _loadServerParameters(): Observable<any> {
    return this.http.get<any>(this.servicesUrl + '/postLogin/parameters').pipe(
      map((response) => {
        const parameters = new Dictionary<Parameter>()

        response.parameterList.items.forEach((parameter: Parameter) => {
          parameters.add(parameter.parameterId, parameter)
        })

        this.storageService.store('parameters', parameters)
        return response
      }),
    )
  }

  public loadAccounts(): Observable<any> {
    return this.http
      .get<LoginResponse>(this.servicesUrl + '/postLogin/loadAccounts')
      .pipe(
        map((response: LoginResponse) => {
          let result = {}

          if (response.errorCode && response.errorCode !== '0') {
            result = {
              error: true,
              errorCode: response.errorCode,
              errorDescription: response.errorDescription,
            }
          }
          return result
        }),
      )
  }

  public loadMenu(): Observable<any> {
    return this.http
      .get<LoginResponse>(this.servicesUrl + '/postLogin/loadMenuOptionList ')
      .pipe(
        map((response: any) => {
          let result = {}
          if (response.errorCode && response.errorCode !== '0') {
            result = {
              error: true,
              errorCode: response.errorCode,
              errorDescription: response.errorDescription,
            }
          } else {
            const services = new Dictionary<boolean>()

            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < response.services.length; i++) {
              services.add(
                response.services[i].description,
                response.services[i].active,
              )
            }
            this.storageService.store('services', services)
          }
          return result
        }),
      )
  }

  public loadWelcome(): Observable<any> {
    return this.http
      .get<LoginResponse>(this.servicesUrl + '/postLogin/welcomePageLimit ')
      .pipe(
        map((response: any) => {
          let result = {}
          if (response.errorCode && response.errorCode !== '0') {
            result = {
              error: true,
              errorCode: response.errorCode,
              errorDescription: response.errorDescription,
            }
          }
          if (response.errorCode && response.errorCode == 0) {
            this.storageService.store('welcome', response)
          }

          return result
        }),
      )
  }

  public validUser(
    _userId: string,
    _companyId: string,
    _password: string,
  ): Observable<any> {
    const body = JSON.stringify({
      companyId: _companyId,
      userId: _userId,
      passwordEn: this.cryptoService.encryptRSA(_password),
    })

    return this.http.post(this.servicesUrl + '/login/validUser', body).pipe(
      map((response: any) => {
        let result
        const json = response
        if (!json.errorCode || json.errorCode == 0) {
          //this.processSucessfullAuth(json);
          result = response
        } else {
          this.logService.log.error(json.errorCode)
          result = {
            error: true,
            errorCode: json.errorCode,
            errorDescription: this.errorLanguage(json),
          }
        }

        return result
      }),
      catchError((res) => {
        this.logService.log.error(res)
        const result = {
          error: true,
          errorCode: -1,
          errorDescription: 'Communications error',
        }
        return of(result)
      }),
    )
  }

  public validCivilianId(
    _civilianId: string,
    _password: string,
  ): Observable<any> {
    const body = JSON.stringify({
      nationalId: _civilianId,
      passwordEn: this.cryptoService.encryptRSA(_password),
    })

    return this.http.post(this.servicesUrl + '/login/validUser', body).pipe(
      map((response: any) => {
        let result
        const json = response
        if (!json.errorCode || json.errorCode == 0) {
          //this.processSucessfullAuth(json);
          result = response
        } else {
          this.logService.log.error(json.errorCode)
          result = {
            error: true,
            errorCode: json.errorCode,
            errorDescription: this.errorLanguage(json),
          }
        }

        return result
      }),
      catchError((res) => {
        this.logService.log.error(res)
        const result = {
          error: true,
          errorCode: -1,
          errorDescription: 'Communications error',
        }
        return of(result)
      }),
    )
  }

  public processSucessfullAuth(json) {
    const token = json.token
    const company: Company = json.company
    const user: User = json.user
    const expirationTimestamp = json.expirationTimestamp
    const termConditionPending = new Dictionary<boolean>()
    const hasChallengeQuestions = json.hasChallengeQuestions
    const disclaimerList = json.disclaimerList

    this.updateGroups(json)


    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < json.termConditionPending.length; i++) {
      termConditionPending.add(json.termConditionPending[i], true)
    }
    this.storageService.store('termConditionPending', termConditionPending)

    this.storageService.store(
      'currentUser',
      JSON.stringify({
        user,
        company,
        token,
        expirationTimestamp,
        hasChallengeQuestions,
      }),
    )


    this.updatePrivileges(json)
    this.storageService.store('company', company)
    this.storageService.store('user', user)
    this.storageService.store('disclaimerList', disclaimerList)
    //this.initateUser();
  }

  //TODO TEMPORAL , CHANGE FOR REAL DEV
  public userLogged(): boolean {
    let result = false

    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    if (currentUser && currentUser.user) {
      result = true
    }

    return result
  }

  public mustSignTermsAndConditions(privilege) {
    const termConditionPending = this.storageService.retrieve(
      'termConditionPending',
    )

    if (termConditionPending.items[privilege]) {
      return true
    }
    return false
  }

  public activateOption(
    service: string,
    privilege: string[],
    listgroup: string[],
  ): boolean {
    const activeser = this.serviceisActive(service)
    const activepriv = this.companyhasPrivilege(privilege)
    const activegrp = this.userHasAnyGroup(listgroup)
    if (activeser) {
      if (activepriv) {
        if (activegrp) {
          return true
        }
      }
    }

    return false
  }

  public activateOptionWithoutService(
    privilege: string[],
    listgroup: string[],
  ): boolean {
    const activepriv = this.companyhasPrivilege(privilege)
    const activegrp = this.userHasAnyGroup(listgroup)

    if (activepriv) {
      if (activegrp) {
        return true
      }
    }

    return false
  }

  private companyhasPrivilege(group: string[]): boolean {
    if (group === null || group.length === 0) {
      return true
    }
    let result = false
    const privileges = this.storageService.retrieve('privileges')
    if (privileges) {
      for (const pr of group) {
        if (privileges.items[pr]) {
          result = true
        }
      }
    }
    return result
  }

  private serviceisActive(group: string): boolean {
    let result = false

    const services = this.storageService.retrieve('services')
    if (services) {
      if (services.items[group]) {
        result = services.items[group]
      }
    }
    return result
  }

  public userHasAnyGroup(listgroup: string[]): boolean {
    let result = false
    if (listgroup === null || listgroup.length === 0) {
      return true
    }
    const groups = this.storageService.retrieve('groups')
    if (groups) {
      for (const _group of listgroup) {
        if (groups.items[_group]) {
          result = true
        }
      }
    }
    return result
  }

  public loginOtp(
    _userId: string,
    _companyId: string,
    _otp: string,
    _password: string,
  ): Observable<any> {
    const body = JSON.stringify({
      companyId: _companyId,
      userId: _userId,
      passwordEn: this.cryptoService.encryptRSA(_password),
      otp: _otp,
    })

    return this.http.post(this.servicesUrl + '/login/validOTP', body).pipe(
      map((response: any) => {
        let result
        const json = response
        if (!json.errorCode || json.errorCode === '0') {
          this.processSucessfullAuth(json)
          // Renew session
          this.renewSession(response.tokenValidaityInSecond)
          result = {
            error: false,
          }
        } else {
          result = {
            error: true,
            errorCode: json.errorCode,
            errorDescription: this.errorLanguage(json),
          }
        }

        return result
      }),
      catchError((res) => {
        const result = {
          error: true,
          errorCode: -1,
          errorDescription: 'Communications error',
        }
        return of(result)
      }),
    )
  }

  public loginSoftToken(
    _userId: string,
    _companyId: string,
    _password: string,
    _challenge: string,
    _response: string,
  ): Observable<any> {
    const body = JSON.stringify({
      companyId: _companyId,
      userId: _userId,
      passwordEn: this.cryptoService.encryptRSA(_password),
      challenge: _challenge,
      response: _response,
    })

    return this.http.post(this.servicesUrl + '/login/validToken', body).pipe(
      map((response: any) => {
        let result

        const json = response

        if (!json.errorCode || json.errorCode === '0') {
          this.processSucessfullAuth(json)
          result = {
            error: false,
          }
        } else {
          result = {
            error: true,
            errorCode: json.errorCode,
            errorDescription: this.errorLanguage(json),
            authentication: json.authentication,
          }
        }

        return result
      }),
      catchError((res) => {
        const result = {
          error: true,
          errorCode: -1,
          errorDescription: 'Communications error',
        }
        return of(result)
      }),
    )
  }

  doChangePassword(oldPassword: string, newPassword: string): Observable<any> {
    const data: any = {}
    if (oldPassword) {
      data.oldPassword = this.cryptoService.encryptRSA(oldPassword)
    }
    if (newPassword) {
      data.password = this.cryptoService.encryptRSA(newPassword)
    }
    return this.http
      .post(this.servicesUrl + '/userProfile/updatePassword', data)
      .pipe(
        map((response: any) => {
          let result

          const json = response

          if (!json.errorCode || json.errorCode == 0) {
            result = {
              error: false,
            }
          } else {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
          }
          return result
        }),
        catchError((res) => {
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public updateTutorial(): Observable<any> {
    return this.http.post(this.servicesUrl + '/postLogin/tutorial', null).pipe(
      map((json: any) => {
        return json
      }),
      catchError((res) => {
        const result = {
          error: true,
          errorCode: -1,
          errorDescription: 'Communications error',
        }
        return of(result)
      }),
    )
  }

  public renewToken(): Observable<any> {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const token = currentUser.token

    if (!token) {
      const result = {
        error: true,
        errorCode: -1,
        errorDescription: 'Token error',
      }
      return of(result)
    } else {
      const body = {
        token,
        displayLoading: false,
      }

      return this.http.post(this.servicesUrl + '/postLogin/renew', body).pipe(
        map((json: any) => {
          const result = {}

          const newToken = json.token
          const newExpirationTimestamp = json.expirationTimestamp

          const _currentUser = JSON.parse(
            this.storageService.retrieve('currentUser'),
          )
          _currentUser.token = newToken
          _currentUser.expirationTimestamp = newExpirationTimestamp
          this.storageService.store('currentUser', JSON.stringify(_currentUser))
          return result
        }),
        catchError((res) => {
          clearInterval(this.renewSessionInterval)
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
    }
  }

  public logout(): Observable<any> {
    // clear token remove user from local storage to log user out

    return this.http.post(this.servicesUrl + '/postLogin/logout', null).pipe(
      map((response: any) => {
        let result

        const json = response

        if (!json.errorCode || json.errorCode == 0) {
          this.storageService.clearAll()
          result = {
            error: false,
          }
        } else {
          result = {
            error: true,
            errorCode: json.errorCode,
            errorDescription: this.errorLanguage(json),
          }
        }
        clearInterval(this.renewSessionInterval)
        return result
      }),
      catchError((res) => {
        const result = {
          error: true,
          errorCode: -1,
          errorDescription: 'Communications error',
        }
        return of(result)
      }),
    )
  }

  public putClickMessage(idMessage): Observable<any> {
    // clear token remove user from local storage to log user out

    return this.http.put(this.servicesUrl + '/campaingService/message', {
      message: idMessage,
    })
  }

  public getToken(): string {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const token = currentUser && currentUser.token
    return token
  }

  public getUser(): any {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    if (currentUser) {
      return currentUser
    } else {
      return '{}'
    }
  }

  public errorLanguage(error) {
    if (error) {
      if (
        this.translate.currentLang === 'ar' &&
        error.errorResponse &&
        error.errorResponse.arabicMessage
      ) {
        return error.errorResponse.arabicMessage
      }
      return error.errorDescription
    }
  }

  public getPasswordInputPattern() {
    const specialChars = ',.?/">~!@#$%^&*_-+=`|(){}[]:;"\'<>,.?/'
    let specialCharsCodes = ''
    specialChars.split('').forEach((l) => {
      //console.log(l + ' -> &#'+l.charCodeAt(0));
      specialCharsCodes += '\\u' + l.charCodeAt(0).toString(16).padStart(4, '0')
    })
    const pattern =
      '^(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?!.*[\\u0600-\\u06ff\\u0750-\\u077f\\ufb50-\\ufc3f\\ufe70-\\ufefc])(?!.*(.)\\1{2,2}).{8,14}$'
    return pattern
  }

  public validUserGetSecondAuthenticationMethod(
    _userId: string,
    _companyId: string,
  ): Observable<any> {
    const body = JSON.stringify({
      companyId: _companyId,
      userId: _userId,
    })

    return this.http
      .post(this.servicesUrl + '/login/challengeQuestions/validUser', body)
      .pipe(
        map((response: any) => {
          let result

          const json = response

          if (!json.errorCode || json.errorCode == 0) {
            result = response
          } else {
            this.logService.log.error(json.errorCode)
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
          }
          return result
        }),
        catchError((res) => {
          this.logService.log.error(res)
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public validUserForceOTPMethod(
    _userId: string,
    _companyId: string,
    _password: string,
  ): Observable<any> {
    const body = JSON.stringify({
      companyId: _companyId,
      userId: _userId,
      password: this.cryptoService.encryptRSA(_password),
    })

    return this.http
      .post(this.servicesUrl + '/login/challengeQuestions/validUserOTP', body)
      .pipe(
        map((response: any) => {
          let result

          const json = response

          if (!json.errorCode || json.errorCode == 0) {
            result = response
          } else {
            this.logService.log.error(json.errorCode)
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
          }
          return result
        }),
        catchError((res) => {
          this.logService.log.error(res)
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public obtainChallengeQuestionsOTP(
    _userId: string,
    _companyId: string,
    _otp: string,
  ): Observable<any> {
    const body = JSON.stringify({
      companyId: _companyId,
      userId: _userId,
      otp: _otp,
    })
    return this.http
      .post(this.servicesUrl + '/login/challengeQuestions/validOTPToken', body)
      .pipe(
        map((response: any) => {
          let result
          const json = response
          if (!json.errorCode || json.errorCode === '0') {
            result = json
            result.error = false
          } else {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
          }
          return result
        }),
        catchError((res) => {
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public obtainChallengeQuestionsToken(
    _userId: string,
    _companyId: string,
    _challenge: string,
    _response: string,
  ): Observable<any> {
    const body = JSON.stringify({
      companyId: _companyId,
      userId: _userId,
      challenge: _challenge,
      response: _response,
    })
    return this.http
      .post(this.servicesUrl + '/login/challengeQuestions/validOTPToken', body)
      .pipe(
        map((response: any) => {
          let result
          const json = response
          if (!json.errorCode || json.errorCode === '0') {
            result = json
            result.error = false
          } else {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
          }
          return result
        }),
        catchError((res) => {
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public registerChallengeQuestions(
    formData: any,
    questionsNumbers = 4,
  ): Observable<any> {
    const data: any = {}
    let ChallengeListObtain: ChallengeList[] = []
    if (formData) {
      ChallengeListObtain =
        this.buildChallengeQuestionRequestDataForTermsConditions(
          formData,
          questionsNumbers,
        )
      data.challengeQuestionsList = ChallengeListObtain
    }
    return this.http
      .post(this.servicesUrl + '/userManagement/userChallengeQuestions', data)
      .pipe(
        map((response: any) => {
          let result

          const json = response
          if (!json.errorCode || json.errorCode == 0) {
            result = {
              error: false,
            }
          } else {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
          }
          return result
        }),
        catchError((res) => {
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public registerPasswordChallengeQuestions(
    formData: any,
    oldPassword: string,
    password: string,
  ): Observable<any> {
    const data: any = {}
    const questionsNumbers = 4
    let ChallengeListObtain: ChallengeList[] = []
    if (formData) {
      ChallengeListObtain =
        this.buildChallengeQuestionRequestDataForTermsConditions(
          formData,
          questionsNumbers,
        )
      data.challengeQuestionsList = ChallengeListObtain
      data.oldPassword = this.cryptoService.encryptRSA(oldPassword)
      data.password = this.cryptoService.encryptRSA(password)
    }
    return this.http
      .post(
        this.servicesUrl + '/userManagement/userPasswordChallengeQuestions',
        data,
      )
      .pipe(
        map((response: any) => {
          let result

          const json = response
          if (json.errorCode != 0) {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
          } else {
            result = response
            result.error = false
          }
          return result
        }),
        catchError((res) => {
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public buildChallengeQuestionRequestDataForTermsConditions(
    formData: any,
    questionsNumbers: number,
  ): ChallengeList[] {
    const list: ChallengeList[] = []
    let challengeQuestionsList = new ChallengeList()
    challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA('1')
    challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
      formData.firstQuestion,
    )
    list.push(challengeQuestionsList)

    challengeQuestionsList = new ChallengeList()
    challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA('2')
    challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
      formData.secondQuestion,
    )
    list.push(challengeQuestionsList)

    challengeQuestionsList = new ChallengeList()
    challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA('3')
    challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
      formData.thirdQuestion,
    )
    list.push(challengeQuestionsList)

    challengeQuestionsList = new ChallengeList()
    challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA('4')
    challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
      formData.fourthQuestion,
    )
    list.push(challengeQuestionsList)

    // for (let i = 1; i <= questionsNumbers; i++) {
    //     const challengeQuestionsList = new ChallengeList()
    //     if()
    //     if (formData['question' + i]) {
    //         challengeQuestionsList.questionId = i
    //         challengeQuestionsList.questionValue = formData['question' + i]
    //         list.push(challengeQuestionsList)
    //     }
    // }
    return list
  }

  public buildChallengeQuestionRequestDataForLogin(
    formData: any,
    questionsNumbers: number,
  ): ChallengeList[] {
    const list: ChallengeList[] = []
    for (let i = 1; i <= questionsNumbers; i++) {
      const challengeQuestionsList = new ChallengeList()

      if (formData['question' + i] && formData['question' + i] != '') {
        challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA(
          '' + i,
        )
        challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
          formData['question' + i],
        )
        list.push(challengeQuestionsList)
      }
    }
    return list
  }

  public validateInitResetToken(
    answers: any,
    token: any,
    questionsNumbers: number,
    hasToken = true,
  ): Observable<any> {
    const body: any = {}
    if (answers) {
      body.companyId = answers['companyId']
      body.userId = answers['userId']
      body.password =
        !hasToken && answers['password']
          ? this.cryptoService.encryptRSA(answers['password'])
          : null
    }
    return this.http
      .post(
        this.servicesUrl + '/login/challengeQuestions/validInitResetToken',
        body,
      )
      .pipe(
        map((response: any) => {
          let result
          response.token = token
          const json = response
          if (!json.errorCode || json.errorCode == 0) {
            result = response
            //this.processSucessfullAuth(result)
          } else {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
            this.logService.log.error(json.errorCode)
          }
          return result
        }),
        catchError((res) => {
          this.logService.log.error(res)
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public validateChallengeAnswers(
    answers: any,
    token: any,
    questionsNumbers: number,
    hasToken = true,
  ): Observable<any> {
    const body: any = {}
    let ChallengeListObtain: ChallengeList[] = []
    if (answers) {
      ChallengeListObtain = this.buildChallengeQuestionRequestDataForLogin(
        answers,
        questionsNumbers,
      )
      body.challengeQuestionsList = ChallengeListObtain
      body.companyId = answers['companyId']
      body.userId = answers['userId']
      body.password =
        !hasToken && answers['password']
          ? this.cryptoService.encryptRSA(answers['password'])
          : null
    }
    return this.http
      .post(
        this.servicesUrl +
        (hasToken
          ? '/userManagement/userChallengeQuestions/validateQuestions'
          : '/userManagement/userChallengeQuestions/validateQuestions'),
        body,
      )
      .pipe(
        map((response: any) => {
          let result
          response.token = token
          const json = response
          if (!json.errorCode || json.errorCode == 0) {
            result = response
            //this.processSucessfullAuth(result)
          } else {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
            this.logService.log.error(json.errorCode)
          }
          return result
        }),
        catchError((res) => {
          this.logService.log.error(res)
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public confirmChallengeAnswersAndNewPassword(
    answers: any,
    token: any,
    questionsNumbers,
    notifyUser: boolean,
  ): Observable<any> {
    const body: any = {}
    let ChallengeListObtain: ChallengeList[] = []
    if (answers) {
      ChallengeListObtain = this.buildChallengeQuestionRequestDataForLogin(
        answers,
        questionsNumbers,
      )
      body.challengeQuestionsList = ChallengeListObtain
      body.companyId = answers['companyId']
      body.userId = answers['userId']
      body.password = this.cryptoService.encryptRSA(answers['newPassword'])
      body.notifyUser = notifyUser

      //body.password = answers.newPassword
    }
    return this.http
      .post(
        this.servicesUrl +
        '/userManagement/userChallengeQuestions/confirmResetPassword',
        body,
      )
      .pipe(
        map((response: any) => {
          let result
          response.token = token
          const json = response
          if (!json.errorCode || json.errorCode == 0) {
            result = response
            this.processSucessfullAuth(result)
          } else {
            result = {
              error: true,
              errorCode: json.errorCode,
              errorDescription: this.errorLanguage(json),
            }
            this.logService.log.error(json.errorCode)
          }
          return result
        }),
        catchError((res) => {
          this.logService.log.error(res)
          const result = {
            error: true,
            errorCode: -1,
            errorDescription: 'Communications error',
          }
          return of(result)
        }),
      )
  }

  public confirmChallengeAnswersAndNewToken(
    answers: any,
    token: any,
    questionsNumbers,
  ): Observable<any> {
    const body: any = {}
    let ChallengeListObtain: ChallengeList[] = []
    if (answers) {
      ChallengeListObtain = this.buildChallengeQuestionRequestDataForLogin(
        answers,
        questionsNumbers,
      )

      body.companyId = answers['companyId']
      body.userId = answers['userId']
      body.passwordEn = this.cryptoService.encryptRSA(answers['password'])

      body.challengeNumber = this.cryptoService.encryptRSA(
        answers['challengeNumber'],
      )
      body.softToken = answers.authData.softToken
      body.challengeQuestionsList = ChallengeListObtain
    }
    return this.http.post(this.servicesUrl + '/login/resetToken', body).pipe(
      map((response: any) => {
        let result
        const json = response
        if (json.errorCode == 0) {
          result = response
          result.error = null
        } else {
          result = {
            error: true,
            errorCode: json.errorCode,
            errorDescription: this.errorLanguage(json),
          }
          this.logService.log.error(json.errorCode)
        }
        return result
      }),
      catchError((res) => {
        this.logService.log.error(res)
        const result = {
          error: true,
          errorCode: -1,
          errorDescription: 'Communications error',
        }
        return of(result)
      }),
    )
  }

  private renewSession(tokenValidaityInSecond = 900) {
    this.renewSessionInterval = setInterval(() => {
      this.renewToken().subscribe((result) => {
        if (result.error) {
          this._router.navigateByUrl('/login')
        }
      })
    }, (tokenValidaityInSecond - 30) * 1000)
  }

  public forgotQuestions(_userId: string, _companyId: string): Observable<any> {
    const body = JSON.stringify({
      companyId: _companyId,
      userId: _userId,
    })
    return this.http.post(
      this.servicesUrl + '/login/challengeQuestions/forgotQuestions',
      body,
    )
  }

  public async changeToNewPriv(json) {
    await this.updateComapny(json)
    await this.updateGroups(json)
    await this.updatePrivileges(json)
    this.smq.publish('privilege-update', true)
  }

  updatePrivileges(json) {
    const privileges = new Dictionary<boolean>()
    for (let i = 0; i < json.company.privileges.length; i++) {
      privileges.add(json.company.privileges[i].privilegeId, true)
    }
    this.storageService.store('privileges', privileges)
  }

  updateGroups(json) {
    const groups = new Dictionary<boolean>()
    for (let i = 0; i < json.groups.length; i++) {
      groups.add(json.groups[i], true)
    }
    return this.storageService.store('groups', groups)
  }

  updateComapny(json) {
    const company: Company = json.company
    this.storageService.store('company', company)
  }
}
