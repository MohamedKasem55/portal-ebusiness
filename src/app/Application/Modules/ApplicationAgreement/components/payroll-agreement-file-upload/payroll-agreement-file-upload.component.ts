import {
  Component,
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { PayrollAgreementFileUploadService } from './payroll-agreement-file-upload.service'
import { SimpleMQ } from 'ng2-simple-mq'

@Component({
  selector: 'app-payroll-agreement-file-upload',
  templateUrl: './payroll-agreement-file-upload.component.html',
  styleUrls: ['./payroll-agreement-file-upload.component.scss'],
})
export class PayrollAgreementFileUploadComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  routes: any[] = [
    ['payroll-agreement.menu'],
    [
      'payroll-agreement.download-templates',
      ['/app_and_agreement/payroll-agreement'],
    ],
    ['payroll-agreement.fileUpload'],
  ]

  combosKeys: any[] = ['regions']
  combosData: any = {}

  fieldsConfigs: any[] = []

  constructor(
    public fileUploadService: PayrollAgreementFileUploadService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public fb: FormBuilder,
    public translate: TranslateService,
    public router: Router,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
    private smq: SimpleMQ,
  ) {
    super(fb, translate, router)

    this.combosData['regions'] = []
    this.formModel = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()
    this.subscriptions.push(
      this.fileUploadService.regions().subscribe((result) => {
        const regions = result.props
        this.combosData['regions'] = []
        for (const property in regions) {
          this.combosData['regions'].push({
            key: property,
            value: regions[property],
          })
        }
        this.fieldsConfigs = this.fileUploadService.getFieldsConfigForForm()
      }),
    )
  }

  refreshData() {
    super.refreshData()
    this.subscriptions.push(
      this.fileUploadService.regions().subscribe((result) => {
        const regions = result.props
        this.combosData['regions'] = []
        for (const property in regions) {
          this.combosData['regions'].push({
            key: property,
            value: regions[property],
          })
        }
      }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getBackUrl() {
    return '/app_and_agreement/payroll-agreement'
  }

  isDisabled() {
    let enabled = true
    switch (this.wizardStep) {
      case 1:
        enabled = this.formModel != null && this.formModel.valid
        break
      case 2:
        enabled = this.valid()
        break
      default:
        break
    }
    return !enabled
  }

  valid() {
    return !(
      this.validationResponse &&
      this.validationResponse.errors &&
      this.validationResponse.errors.length > 0
    )
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        const fileData = this.formModel.get('file').value
        if (fileData?.file.size > 2000000) {
          this.translate
            .get('payroll-agreement.file-size-error')
            .subscribe((value) => this.smq.publish('error-mq', value))
        } else {
          const dataToValidate = {
            file: fileData ? fileData.file : null,
            fileName: fileData ? fileData.name : null,
            region: this.formModel.get('region').value,
          }
          this.fileUploadService
            .validate(dataToValidate)
            .subscribe((result) => {
              if (result['errorCode'] != '0') {
                this.onError(result)
              } else {
                this.validationResponse = result
                this.formModel.disable()
                this.markNextWizardStep()
              }
            })
        }
        break
      case 2:
        const dataToConfirm = {
          file: this.validationResponse.file,
          fileName: this.validationResponse.fileName,
          region: this.validationResponse.region,
        }
        this.fileUploadService.confirm(dataToConfirm).subscribe((result) => {
          if (result['errorCode'] != '0') {
            this.onError(result)
          } else {
            this.validationResponse = result
            this.markNextWizardStep()
          }
        })
        break
      case 3:
        this.finish()
        break
    }
  }

  previous() {
    this.markPreviousWizardStep()
    if (this.wizardStep == 1) {
      this.formModel.enable()
    }
  }

  finish() {
    this.router.navigate([this.getBackUrl()])
  }

  back() {
    this.router.navigate([this.getBackUrl()])
  }

  getWizardStepsCount() {
    return 3
  }

  onInitStep(step, events) {}

  fileChange($event) {
    const fileList: FileList = $event.target.files
    if (fileList.length > 0) {
      const _file = $event.target.files[0]
      this.formModel.controls['file'].patchValue(_file)
      this.formModel.controls['fileName'].patchValue(_file.name)
    }
  }

  isValidator() {
    return this.authenticationService.activateOption(
      'ManagementBAMCompanyAdmin',
      [],
      ['ManagementCompanyAdminValidator'],
    )
  }

  getTranslatedText(text) {
    return this.translate.instant(text)
  }
}
