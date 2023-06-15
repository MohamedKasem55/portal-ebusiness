import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { StorageService } from '../../../../../core/storage/storage.service'
import { FormBuilder, Validators, FormControl } from '@angular/forms'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { AliasManagementService } from '../../Services/alias-management.service'
import { AliasManagement } from '../../Model/alais-management'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-alias-management',
  templateUrl: './alias-management.component.html',
  styleUrls: ['./alias-management.component.scss'],
})
export class AliasManagementComponent implements OnInit {
  @ViewChild('IPSTCStatusModal', { static: true })
  iPSTCStatusModal: ModalDirective

  private mobileNumberValidatorPattern =
    '(\\+9665|05|[+]*[0-9]{1,4})[0-9]{8,8}$'
  private emailPattern = /[a-z0-9\-\_\.]+\@[\w\d\-\_]+\.[\w]+/

  generateChallengeAndOTP: ResponseGenerateChallenge
  requestValidate: RequestValidate = new RequestValidate()
  wizardStep: number = 1
  form: any
  aliasManagement: AliasManagement
  type = 'LINK'
  mensajeError: string = ''

  constructor(
    private router: Router,
    private storageService: StorageService,
    private fb: FormBuilder,
    private aliasManagementService: AliasManagementService,
    public config: ConfigResourceService,
    public translate: TranslateService,
  ) {
    this.wizardStep = 1

    this.form = fb.group({
      account: ['', Validators.required],
      crNumber: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(10),
          Validators.minLength(10),
        ]),
      ],
      mobile: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(this.mobileNumberValidatorPattern),
        ]),
      ],
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(5),
          Validators.pattern(this.emailPattern),
        ]),
      ],
    })
  }

  ngOnInit(): void {
    let context = this
    setTimeout(() => {
      let ipstcstatus = this.getIPSTCStatus()
      if (ipstcstatus != 'ACCEPTED') {
        context.showIPSTCStatusModal()
      }
    }, 1000)
  }

  getIPSTCStatus() {
    const company = this.storageService.retrieve('company')
    return company.ipstcstatus
  }

  showIPSTCStatusModal() {
    this.iPSTCStatusModal.show()
  }

  closeIPSTCStatusModal() {
    this.iPSTCStatusModal.hide()
  }
  unLinkAction(value) {
    let accountControl = this.form.get('account') as FormControl
    this.aliasManagement = new AliasManagement(
      accountControl.value,
      'DELINK_ALL',
      null,
      null,
      value,
      '',
      null,
    )
    this.aliasManagementService
      .validate(this.aliasManagement)
      .subscribe((result) => {
        if (result.errorCode != '0') {
          this.onError(result)
          return
        } else {
          this.wizardStep++
          this.generateChallengeAndOTP = result.generateChallengeAndOTP
        }
      })
  }

  step1Action(data): void {
    if (data.action == 'DELINK_ALL') {
      this.type = 'DELINK_ALL'
    } else {
      let accountControl = this.form.get('account') as FormControl
      let crNumberControl = this.form.get('crNumber') as FormControl
      let mobileControl = this.form.get('mobile') as FormControl
      let emailControl = this.form.get('email') as FormControl

      let proxyAction = data.action
      let proxyType = ''
      let proxyValue = ''
      switch (data.type) {
        case 'UNN':
          proxyType = 'UNN'
          proxyValue = crNumberControl.value
          break
        case 'MOBILE':
          proxyType = 'MOBILE'
          proxyValue = mobileControl.value
          break
        case 'EMAIL':
          proxyType = 'EMAIL'
          proxyValue = emailControl.value
          break
      }
      this.aliasManagement = new AliasManagement(
        accountControl.value,
        proxyAction,
        proxyType,
        proxyValue,
        '',
        data.registrationId,
        null,
      )

      this.aliasManagementService
        .validate(this.aliasManagement)
        .subscribe((result) => {
          if (result.errorCode != '0') {
            this.onError(result)
            return
          } else {
            this.wizardStep++
            this.generateChallengeAndOTP = result.generateChallengeAndOTP
          }
        })
    }
  }

  step2Action(requestValidate) {
    this.aliasManagement.requestValidate = requestValidate
    console.log(JSON.stringify(this.aliasManagement))
    this.aliasManagementService
      .confirm(this.aliasManagement)
      .subscribe((result) => {
        if (result.errorCode != '0') {
          this.onError(result)
          return
        } else {
          this.wizardStep++
          this.generateChallengeAndOTP = result.generateChallengeAndOTP
        }
      })
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  IPSreject() {
    this.closeIPSTCStatusModal()
    this.aliasManagementService
      .updateIPSTCStatus({ ipstcstatus: 'REJECTED' })
      .subscribe((result) => {})
  }

  IPSagree() {
    this.closeIPSTCStatusModal()
    this.aliasManagementService
      .updateIPSTCStatus({ ipstcstatus: 'ACCEPTED' })
      .subscribe((result) => {
        const company = this.storageService.retrieve('company')
        company.ipstcstatus = 'ACCEPTED'
        this.storageService.store('company', company)
      })
  }
  ipSLater() {
    this.router.navigate(['/'])
    this.closeIPSTCStatusModal()
  }

  showTC() {
    let fileName = 'IPS-Terms_and_Conditions.pdf'

    let url_to_open =
      `${this.config.getDocumentUrl()}/` + fileName
    window.open(url_to_open, '_blank')
  }
}
