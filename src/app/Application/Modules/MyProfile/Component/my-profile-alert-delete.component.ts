// Imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { AlertSelectedPipe } from '../Services/alert-selected-pipe'
import { MyProfileAlertService } from '../Services/my-profile-alert.service'
import { MyProfileStaticService } from '../Services/my-profile-static.service'

@Component({
  templateUrl: '../View/my-profile-alert-delete.component.html',
})
// Component class implementing OnInit
export class MyProfileAlertDelete implements OnInit, OnDestroy {
  @ViewChild('requestSubmittedModal', { static: true })
  public requestSubmittedModal: ModalDirective

  formAlert: FormGroup

  alerts: any
  lang: string[] = []
  languages: any
  loading: boolean
  languageChanged = false

  constructor(
    public fb: FormBuilder,
    public service: MyProfileAlertService,
    public pipe: AlertSelectedPipe,
    public staticService: MyProfileStaticService,
    public translate: TranslateService,
    public router: Router,
  ) {
    this.languages = []
    this.createForm()
  }

  createForm() {
    this.formAlert = this.fb.group({
      secretLairs: this.fb.array([]),
    })
  }

  createSubForm(accountnumber, lang, mobile) {
    let language = ''
    if (lang === '1') {
      language = this.languages[0].value
    } else if (lang === '2') {
      language = this.languages[1].value
    }
    return this.fb.group({
      notificationAccount: [accountnumber, Validators.required],
      language: [language, Validators.required],
      mobile: [mobile],
      secretNotifLairs: this.fb.array([]),
    })
  }

  setAlerts(result, form) {
    //console.log('set alerts');
    result.sort((a, b) => {
      return a.notificationType > b.notificationType
        ? 1
        : b.notificationType > a.notificationType
        ? -1
        : 0
    })
    const notifFGs = result.map((notif) => this.fb.group(notif))
    const notifFormArray = this.fb.array(notifFGs)
    form.setControl('secretNotifLairs', notifFormArray)
  }

  // Load data ones componet is ready

  ngOnInit() {
    this.loading = true
    this.alerts = this.pipe.popData()
    //console.log(this.alerts);
    if (this.alerts) {
      this.getLang()
      for (const alert of this.alerts) {
        this.service
          .getModifiedAccounts(alert.accountNumber)
          .subscribe((result) => {
            if (result === null) {
              this.onError(result)
            } else {
              this.lang.push(result.language)
              const arrayControl = <FormArray>(
                this.formAlert.controls.secretLairs
              )
              const subForm = this.createSubForm(
                result.notificationAccount,
                result.language,
                result.mobile,
              )
              this.setAlerts(result.notifications, subForm)
              arrayControl.push(subForm)
            }
          })
      }

      this.translate.onLangChange.subscribe((result) => {
        this.languageChanged = true
        this.getLang()
      })
    } else {
      this.router.navigate(['/myprofile/alerts'])
    }
  }

  getLang() {
    this.staticService.getKeyValue('languages').subscribe((result) => {
      if (result === null) {
        this.onError('Languages error ' + result)
      } else {
        this.languages = result
        this.loading = false
      }
      if (this.languageChanged) {
        this.setLanguage()
      }
    })
  }

  setLanguage() {
    let index = 0
    for (const alert of this.formAlert['controls'].secretLairs['controls']) {
      let language = ''
      if (this.lang[index] === '1') {
        language = this.languages[0].value
      } else if (this.lang[index] === '2') {
        language = this.languages[1].value
      }
      //console.log(language);
      alert['controls'].language.setValue(language)
      index++
    }
  }

  delete() {
    const accounts = []
    for (let i = this.formAlert.value.secretLairs.length - 1; i >= 0; i--) {
      accounts.push(this.formAlert.value.secretLairs[i].notificationAccount)
    }

    //console.log(accounts);
    this.service.deleteAlert(accounts).subscribe((result) => {
      if (result === null) {
        this.onError(result)
      } else {
        this.loading = false
        this.requestSubmittedModal.show()
      }
    })
  }

  onError(result) {
    //
    this.loading = false
  }

  ngOnDestroy() {
    // Clean sub to avoid memory leak
  }
}
