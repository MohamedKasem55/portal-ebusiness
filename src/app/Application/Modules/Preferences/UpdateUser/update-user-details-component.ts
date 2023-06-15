import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subject, Subscription } from 'rxjs'
import { ModelService } from '../../../Components/common/model.service'
import { UpdateMailStep1Component } from './update-mail-step1.component'
import { UpdateMailStep2Component } from './update-mail-step2.component'
import { MailUpdate, UpdateMailService } from './update-mail.service'
import { StorageService } from '../../../../core/storage/storage.service'
import { LockboxAccountsEditService } from '../../Lockbox/cdmaccounts/components/edit/lockbox-accounts-edit.service'
import { ChallengeQuestionService } from './challenge-question-service'
import { UserUpdateService } from './user-update-service'
import { Exception } from '../../../Model/exception'

@Component({
  selector: 'update-user-details-component',
  templateUrl: './update-user-details-component.html',
  styleUrls: ['./update-user-details-component.scss'],
})
export class UpdateUserDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(UpdateMailStep1Component)
  step1: UpdateMailStep1Component
  @ViewChild(UpdateMailStep2Component)
  step2: UpdateMailStep2Component

  form: FormGroup
  wizardStep = 1
  error: string
  view: ViewType
  areaCodes: any[]
  private onDestroy$: Subject<void> = new Subject<void>()
  oldEmail: string

  questionDataItem = {
    firstQuestion: '',
    secondQuestion: '',
    thirdQuestion: '',
    fourthQuestion: '',
  }

  userDataItem = {
    email: '',
    preferedLanguage: '',
    userImage: '',
  }

  questionsEntityProperties: any[] = []

  userEntityProperties: any[] = []

  activeTab: number

  subscriptions: Subscription[] = []

  constructor(
    private updateMailService: UpdateMailService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private modelService: ModelService,
    private storage: StorageService,
    @Inject(LOCALE_ID) private _locale: string,
    public challengeQuestionService: ChallengeQuestionService,
    public userUpdateService: UserUpdateService,
  ) {
    this.form = fb.group({
      newEmail: [
        '',
        [Validators.required, this.mailFormat, Validators.maxLength(50)],
      ],
      confirmEmail: ['', Validators.required],
    })
  }

  ngOnInit() {
    const storageVal = this.storage.retrieve('currentuser')
    if (!storageVal) {
      return
    }

    /**
     * @deprecated
     */
    // this.oldEmail = userTemp && userTemp.user ? userTemp.user.email : null
    // this.form.get('newEmail').setValue(this.oldEmail)
    /**
     *
     */

    this.initUserDetailData()
    this.activeTab = 1
  }

  initUserDetailData() {
    const storageVal = this.storage.retrieve('currentuser')

    const userTemp = JSON.parse(storageVal)

    this.userUpdateService
      .getUserDetails(userTemp.user.userId)
      .subscribe((response: any) => {
        if (
          response.errorCode != '0' ||
          response.hasOwnProperty('error') ||
          response.error instanceof Exception
        ) {
          return
        } else {
          //const userData = response.companyUserDetails;
          //this.userDataItem.email = userData.email;
          //this.userDataItem.preferedLanguage = userData.preferedLanguage;
          //this.userDataItem.userImage = response.userImage;

          const userData = response
          this.userDataItem.email = userData.email
          this.userDataItem.preferedLanguage = userData.language
          this.userDataItem.userImage = response.image

          this.questionsEntityProperties =
            this.challengeQuestionService.configureEditFormModel(userData)
          this.userEntityProperties = null
          this.userEntityProperties =
            this.userUpdateService.configureEditFormModel(this.userDataItem)
        }
      })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next()
    this.onDestroy$.complete()

    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onInitStep1(events) {
    this.step1 = events
  }

  mailFormat(control: FormControl): any {
    const EMAIL_REGEXP =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      control.value != '' &&
      (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
    ) {
      return { incorrectMailFormat: true }
    }
    return null
  }

  getBackUrl() {
    return '/'
  }

  getUserProfile() {
    return 'preferences/user-profile'
  }

  setActiveTab(tab) {
    this.activeTab = tab
  }

  isActiveTab(tab) {
    return this.activeTab == tab
  }

  handleOnSuccess({ result, postData }) {
    if (result.errorCode && result.errorCode != '0') {
      return
    } else {
      const storageVal = this.storage.retrieve('currentuser')
      if (storageVal) {
        const userTemp = JSON.parse(storageVal)
        userTemp.user.email = postData.mail
        this.storage.store('currentuser', JSON.stringify(userTemp))
      }
    }
  }

  handleOnFinish(postData) {
    console.log('ONFINISH', postData)
    if (postData) {
      this.initUserDetailData()
    }
  }
}

export enum ViewType {
  DETAIL = 'detail',
  WIZARD = 'wizard',
}
