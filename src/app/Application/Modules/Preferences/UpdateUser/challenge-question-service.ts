import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { AbstractActionModifyService } from '../../Common/Services/Abstract/abstract-action-modify.service'
import { CryptoService } from '../../../../core/crypto/crypto.service'
import { FormControl } from '@angular/forms'

export class ChallengeList {
  questionId: number
  questionIdStr: string
  questionValue: string
}

// tslint:disable-next-line:max-classes-per-file
@Injectable({ providedIn: 'root' })
export class ChallengeQuestionService extends AbstractActionModifyService {
  validateResponse: any

  constructor(
    protected router: Router,
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
    public sanitizer: DomSanitizer,
    private cryptoService: CryptoService,
  ) {
    super(http, config)
  }

  public configureEditFormModel(detailsData) {
    const _fieldsConfigForForm = []

    _fieldsConfigForForm.push({
      key: 'firstQuestion',
      title: 'firstQuestion',
      translate: 'first-question',
      type: 'text',
      required: true,
      default:
        detailsData.userChallengeQuestions &&
        detailsData.userChallengeQuestions[0]
          ? ''
          : '',
      validators: [this.getValidatorEqualFields],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: true,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      maxlength: 50,
    })

    _fieldsConfigForForm.push({
      key: 'secondQuestion',
      title: 'secondQuestion',
      translate: 'second-question',
      type: 'text',
      required: true,
      default:
        detailsData.userChallengeQuestions &&
        detailsData.userChallengeQuestions[1]
          ? ''
          : '',
      validators: [this.getValidatorEqualFields],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: true,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      maxlength: 50,
    })

    _fieldsConfigForForm.push({
      key: 'thirdQuestion',
      title: 'thirdQuestion',
      translate: 'third-question',
      type: 'text',
      required: true,
      default:
        detailsData.userChallengeQuestions &&
        detailsData.userChallengeQuestions[2]
          ? ''
          : '',
      validators: [this.getValidatorEqualFields],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: true,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      maxlength: 50,
    })

    //Phone Number
    _fieldsConfigForForm.push({
      key: 'fourthQuestion',
      title: 'fourthQuestion',
      translate: 'fourth-question',
      type: 'text',
      required: true,
      default:
        detailsData.userChallengeQuestions &&
        detailsData.userChallengeQuestions[3]
          ? ''
          : '',
      validators: [this.getValidatorEqualFields],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: true,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      maxlength: 10,
      inputPattern: 'onlyMobileNumbers',
    })

    return _fieldsConfigForForm
  }

  protected createValidateRequest(values: any): Observable<any> {
    const body: any = {}
    let ChallengeListObtain: ChallengeList[] = []

    if (values) {
      ChallengeListObtain = this.buildChallengeQuestionList(values)
      body.challengeQuestionsList = ChallengeListObtain
      body.password = values.newPassword
    }

    this.validateResponse = body
    return of({
      errorCode: '0',
      result: this.validateResponse,
    })
  }

  protected createConfirmRequest(values: any): Observable<any> {
    return this.http.post(
      this.servicesUrl + '/userManagement/userChallengeQuestions',
      this.validateResponse,
    )
  }

  back(route: string) {
    this.router.navigate([route])
  }

  getTrustedHtml(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }

  // method that with the responses obtained from the form forms the challengeList object requested by the service
  public buildChallengeQuestionList(formData: any): ChallengeList[] {
    const list: ChallengeList[] = []
    const questionNum = 5

    for (let i = 1; i < questionNum; i++) {
      const challengeQuestionsList = new ChallengeList()

      if (i === 1 && formData.firstQuestion) {
        challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA(
          '' + i,
        )
        challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
          formData.firstQuestion,
        )
        list.push(challengeQuestionsList)
      } else if (i === 2 && formData.secondQuestion) {
        challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA(
          '' + i,
        )
        challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
          formData.secondQuestion,
        )
        list.push(challengeQuestionsList)
      } else if (i === 3 && formData.thirdQuestion) {
        challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA(
          '' + i,
        )
        challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
          formData.thirdQuestion,
        )
        list.push(challengeQuestionsList)
      } else if (i === 4 && formData.fourthQuestion) {
        challengeQuestionsList.questionIdStr = this.cryptoService.encryptRSA(
          '' + i,
        )
        challengeQuestionsList.questionValue = this.cryptoService.encryptRSA(
          formData.fourthQuestion,
        )
        list.push(challengeQuestionsList)
      }
    }
    return list
  }

  isDisabled() {
    return false
  }

  public getValidatorEqualFields(control: FormControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null
    } else if (control.value != '' && control.parent) {
      var question = control['__KEY__']
      var questions = [
        'firstQuestion',
        'secondQuestion',
        'thirdQuestion',
        'fourthdQuestion',
      ]
      var repeated = false
      questions.forEach((item, i) => {
        if (
          item != question &&
          control.value &&
          control.parent &&
          control.parent.controls[item] &&
          control.parent.controls[item].value == control.value
        ) {
          repeated = true
        }
      })
      if (repeated) {
        return { repeatedQuestions: true }
      }
    }
    return null
  }
}
