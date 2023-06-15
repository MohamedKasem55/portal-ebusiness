// Imports
import {
  Component,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { ModelServiceModifyAlert } from '../Model/my-profile-modificationAlert-service.model'
import { AlertSelectedPipe } from '../Services/alert-selected-pipe'
import { MyProfileAlertService } from '../Services/my-profile-alert.service'
import { MyProfileStaticService } from '../Services/my-profile-static.service'
import { DecimalPipe } from '@angular/common'

@Component({
  templateUrl: '../View/my-profile-alert-edit.component.html',
})
// Component class implementing OnInit
export class MyProfileAlertEdit implements OnInit, OnDestroy {
  @ViewChild('requestSubmittedModal', { static: true })
  public requestSubmittedModal: ModalDirective

  formAlert: FormGroup

  change = true
  alerts: any
  originalNotifications: any = []
  languages: any
  loading: boolean

  constructor(
    public fb: FormBuilder,
    public service: MyProfileAlertService,
    public pipe: AlertSelectedPipe,
    public staticService: MyProfileStaticService,
    public translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string,
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

  createSubForm(accountnumber, language, mobile) {
    return this.fb.group({
      notificationAccount: [accountnumber, Validators.required],
      language: [language, Validators.required],
      mobile: [mobile],
      secretNotifLairs: this.fb.array([]),
    })
  }

  setAlerts(result, form) {
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
    for (let i = 0; i < notifFormArray.controls.length; i++) {
      if (notifFormArray.controls[i].value.notificationFlag) {
        ;(<FormGroup>(
          notifFormArray.controls[i]
        )).controls.notificationAmount.enable()
      } else {
        ;(<FormGroup>(
          notifFormArray.controls[i]
        )).controls.notificationAmount.disable()
      }
      notifFormArray.controls[i]
        .get('notificationAmount')
        .setValue(
          this.transformAmountValue(
            notifFormArray.controls[i].get('notificationAmount').value,
          ),
        )
    }
  }

  ngOnInit() {
    this.loading = true
    this.alerts = this.pipe.popData()
    if (this.alerts) {
      this.staticService.getKeyValue('languages').subscribe((result) => {
        if (result === null) {
          this.onError('Languages error ' + result)
        } else {
          this.languages = result
          this.loading = false
          for (const alert of this.alerts) {
            this.service
              .getModifiedAccounts(alert.accountNumber)
              .subscribe((result2) => {
                if (result2 === null) {
                  this.onError(result2)
                } else {
                  const arrayControl = <FormArray>(
                    this.formAlert.controls.secretLairs
                  )
                  let lang = ''
                  if (result2.language === '1') {
                    lang = 'ar'
                  } else if (result2.language === '2') {
                    lang = 'en'
                  }
                  const subForm = this.createSubForm(
                    result2.notificationAccount,
                    lang,
                    result2.mobile,
                  )
                  this.setAlerts(result2.notifications, subForm)
                  this.originalNotifications.push(
                    JSON.parse(JSON.stringify(result2.originalNotifications)),
                  )
                  arrayControl.push(subForm)
                }
              })
          }
        }
      })

      this.translate.onLangChange.subscribe((res) => {
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
    })
  }

  edit() {
    const accounts = []
    for (let i = this.formAlert.value.secretLairs.length - 1; i >= 0; i--) {
      const modifyAccount = new ModelServiceModifyAlert(
        this.formAlert.value.secretLairs[i].notificationAccount,
        this.formAlert.value.secretLairs[i].language,
      )
      modifyAccount.language = this.formAlert.value.secretLairs[i].language
      modifyAccount.notifications =
        this.formAlert.value.secretLairs[i].secretNotifLairs
      modifyAccount.originalNotifications = this.originalNotifications[i]
      accounts.push(modifyAccount)
    }
    //console.log('dentro de edit: '+accounts);
    //console.log(this.formAlert);
    if (this.formAlert.pristine) {
      this.change = false
      this.requestSubmittedModal.show()
    } else {
      this.change = true
      this.service.editAlert(accounts).subscribe((result) => {
        let error = false
        for (let i = 0; i < result.length; i++) {
          //console.log(result[i]);
          if (result[i].errorCode === '-1') {
            error = true
          }
        }
        if (error) {
          this.onError(result)
        } else {
          this.loading = false
          this.requestSubmittedModal.show()
        }
      })
    }
  }

  toggle(alert, i) {
    const control = <FormArray>alert.controls.secretNotifLairs
    if (control.controls[i].value.notificationFlag) {
      ;(<FormGroup>control.controls[i]).controls.notificationAmount.enable()
    } else {
      //console.log('disable'+0);
      ;(<FormGroup>control.controls[i]).controls.notificationAmount.disable()
    }
  }

  onError(result) {
    //
    this.loading = false
  }

  ngOnDestroy() {
    // Clean sub to avoid memory leak
  }

  transformAmountValue(value) {
    if (value) {
      try {
        const decimalPipe = new DecimalPipe(this.locale)
        return decimalPipe.transform(value, '1.2-6')
      } catch (e) {
        return 0
      }
    }
  }
  transformAmount(element, notification, index) {
    const decimalPipe = new DecimalPipe(this.locale)
    try {
      const valueInput = element.target.value.replace(/,/g, '')
      ;(<FormControl>notification.get('notificationAmount')).setValue(
        valueInput,
      )
      element.target.value = decimalPipe.transform(valueInput, '1.2-6')
    } catch (e) {
      element.target.value = decimalPipe.transform(0, '1.2-6')
      ;(<FormControl>notification.get('notificationAmount')).setValue(0)
    }
  }
}
