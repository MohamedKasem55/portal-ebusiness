// Imports
import {
  Component,
  Inject,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Exception } from 'app/Application/Model/exception'
import { StaticService } from '../../Common/Services/static.service'
import { ModelServiceAccount } from '../Model/my-profile-account-service.model'
import { ModelServiceAlertNotification } from '../Model/my-profile-alert-notification-service.model'
import { MyProfileAlertService } from '../Services/my-profile-alert.service'
import { DecimalPipe } from '@angular/common'

@Component({
  templateUrl: '../View/my-profile-alert-create.component.html',
  styles: [
    `
      .sme-checkbox {
        position: relative;
        margin: 0 1rem 0 0;
        cursor: pointer;
        outline: none;
        width: 22px;
        height: 22px;
      }
    `,
  ],
})
// Component class implementing OnInit
export class MyProfileAlertCreate implements OnInit, OnDestroy {
  @ViewChild('requestSubmittedModal', { static: true })
  public requestSubmittedModal: ModalDirective

  formAlert: FormGroup

  selectabledAccounts: Map<String, ModelServiceAccount>
  accounts: Array<any>
  languages: Array<any>
  loading = false
  mensajeError: any = {}

  isVisiblesError = false

  combosSolicitados: string[] = ['languages']

  wizardStep = 1

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public route: ActivatedRoute,
    public alertService: MyProfileAlertService,
    public translate: TranslateService,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.accounts = []
    this.languages = []
    this.createForm()
  }

  createForm() {
    //console.log('create form')
    this.formAlert = this.fb.group({
      accountNumber: ['', Validators.required],
      language: ['', Validators.required],
      mobile: [{ value: '', disabled: true }],
      secretLairs: this.fb.array([]),
    })
  }

  next() {
    this.wizardStep++
    this.formAlert.disable()
  }

  back() {
    this.wizardStep--
    this.formAlert.enable()
  }

  setAlerts(result) {
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
    this.formAlert.setControl('secretLairs', notifFormArray)
  }

  // Load data ones componet is ready
  ngOnInit() {
    this.wizardStep = 1
    this.formAlert.enable()
    this.getCreateAlert()
    this.getLenguages()
    this.translate.onLangChange.subscribe((res) => {
      this.getLenguages()
    })
  }

  ngOnDestroy() {}

  getLenguages() {
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .subscribe((result) => {
        if (result === null) {
          this.onError('Languages error ' + result)
        } else {
          this.languages = this.staticService.staticRecoverValues(
            this.combosSolicitados,
            result,
            'languages',
          )
          this.loading = false
        }
      })
  }

  //Obtiene la plantilla de datos para poder crear una alarma
  getCreateAlert() {
    this.mensajeError = {}
    this.alertService.getCreateAlertData().subscribe((result) => {
      if (result instanceof Exception) {
        const res = <any>result
        //console.log(res.error);
        this.mensajeError['code'] = res.error.errorCode
        this.mensajeError['description'] = res.error.errorDescription
        return
      } else {
        //console.log('Devuelto ',result);
        this.mensajeError = {}
        this.formAlert.controls['mobile'].setValue(result.mobile)
        this.formAlert.controls['mobile'].updateValueAndValidity()
        this.setAlerts(result.notifications)
        this.selectabledAccounts = result.accounts
        //console.log('Accounts '+result.accounts);
        this.selectabledAccounts.forEach((value, key: string) => {
          //console.log('Key '+key);
          this.accounts.push({
            key,
            value: key,
          })
        })
      }
    })
  }

  onError(error) {
    //console.log(error);
    this.mensajeError['code'] = error.errorCode
    this.mensajeError['description'] = error.errorDescription
    return
  }

  create() {
    this.alertService
      .addAlert(
        this.selectabledAccounts.get(this.formAlert.value.accountNumber),
        this.formAlert.controls.language.value,
        this.getAlertNotifications(),
      )
      .subscribe((result) => {
        if (result === null || result.errorCode !== '0') {
          this.onError(result)
        } else {
          this.loading = false
          this.isVisiblesError = false
          this.wizardStep++
          this.formAlert.enable()
        }
      })
  }

  getAlertNotifications(): Array<ModelServiceAlertNotification> {
    const formModel = this.formAlert.value
    const secretLairsDeepCopy: ModelServiceAlertNotification[] =
      formModel.secretLairs.map((notification: ModelServiceAlertNotification) =>
        Object.assign({}, notification),
      )
    return secretLairsDeepCopy
  }

  toggle(i) {
    const control = <FormArray>this.formAlert.controls.secretLairs
    if (control.controls[i].value.notificationFlag) {
      ;(<FormGroup>(
        control.controls[i]
      )).controls.notificationAmount.setValidators([Validators.required])
      ;(<FormGroup>(
        control.controls[i]
      )).controls.notificationAmount.updateValueAndValidity()
      ;(<FormGroup>control.controls[i]).controls.notificationAmount.enable()
    } else {
      //console.log('disable'+0);
      ;(<FormGroup>control.controls[i]).controls.notificationAmount.disable()
      ;(<FormGroup>(
        control.controls[i]
      )).controls.notificationAmount.clearValidators()
      ;(<FormGroup>(
        control.controls[i]
      )).controls.notificationAmount.updateValueAndValidity()
      ;(<FormGroup>control.controls[i]).controls.notificationAmount.reset()
    }
  }

  disabledForm() {
    const control = <FormArray>this.formAlert.controls.secretLairs
    let valid = false
    for (let i = control.controls.length - 1; i >= 0; i--) {
      valid = valid || control.controls[i].value.notificationFlag
    }
    return !this.formAlert.valid || !valid
  }

  // focusOutAmount(value,index): void {
  //     try {
  //         if (value) {
  //             const decimalPipe = new DecimalPipe(this.locale);
  //             // formAlert.controls.secretLairs['controls']
  //             this.formAlert.controls.secretLairs['controls'][index]
  //                 .get("notificationAmount")
  //                 .setValue(
  //                     // decimalPipe.transform(value.value, "1.2-6").replace(/,/g, "")
  //                     decimalPipe.transform(value.value, "1.2-6")
  //                 );
  //         }
  //     } catch (e) {
  //         this.formAlert.controls.secretLairs['controls'][index].get("notificationAmount").setValue("")
  //     }
  // }

  transformAmount(element, index) {
    const decimalPipe = new DecimalPipe(this.locale)
    try {
      const valueInput = element.target.value.replace(/,/g, '')
      this.formAlert.controls.secretLairs['controls'][index]
        .get('notificationAmount')
        .setValue(valueInput)
      element.target.value = decimalPipe.transform(valueInput, '1.2-6')
    } catch (e) {
      element.target.value = decimalPipe.transform(0, '1.2-6')
      this.formAlert.controls.secretLairs['controls'][index]
        .get('notificationAmount')
        .setValue(0)
    }
  }
}
