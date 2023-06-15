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
import { LetterGuaranteeFileUploadService } from './letter-guarantee-file-upload.service'
import { StaticService } from '../../../Common/Services/static.service'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { LetterGuaranteeListService } from '../letter-guarantee-list/letter-guarantee-list.service'

@Component({
  selector: 'app-letter-guarantee-file-upload',
  templateUrl: './letter-guarantee-file-upload.component.html',
  styleUrls: ['./letter-guarantee-file-upload.component.scss'],
})
export class LetterGuaranteeFileUploadComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  routes: any[] = [
    ['letter_guarantee.menu'],
    [
      'letter_guarantee.download-templates',
      ['/app_and_agreement/lg-application'],
    ],
    ['letter_guarantee.fileUpload'],
  ]

  combosKeys: any[] = ['branches']
  combosData: any = {}

  fieldsConfigs: any[] = []

  constructor(
    public fileUploadService: LetterGuaranteeFileUploadService,
    public listService: LetterGuaranteeListService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public fb: FormBuilder,
    public translate: TranslateService,
    public router: Router,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super(fb, translate, router)

    this.combosData['branches'] = []
    this.formModel = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()
    //this.combosData['branches'] = [];
    this.subscriptions.push(
      this.listService.branches().subscribe((result) => {
        if (result.errorCode !== '0') {
        } else {
          const branches = result.items
          this.combosData['branches'] = []
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < branches.length; i++) {
            this.combosData['branches'].push({
              key: branches[i],
              value:
                (branches[i].branchRbs5 != '00000'
                  ? branches[i].branchRbs5 + ' - '
                  : '') +
                (this.translate.currentLang == 'ar'
                  ? branches[i]['branchName']
                  : branches[i]['branchNameEn']),
            })
          }
          // -----------------------------------------------
          this.fieldsConfigs = this.fileUploadService.getFieldsConfigForForm()
        }
      }),
    )
  }

  refreshData() {
    super.refreshData()
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.combosData['branches'].length; i++) {
      const branch = this.combosData['branches'][i].key
      this.combosData['branches'][i].value =
        (branch.branchRbs5 != '00000' ? branch.branchRbs5 + ' - ' : '') +
        (this.translate.currentLang == 'ar'
          ? branch['branchName']
          : branch['branchNameEn'])
    }
    if (this.formModel && this.formModel.get('branch')) {
      this.fileUploadService.updateFieldsByBranchSelected(this.formModel)
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getBackUrl() {
    return '/app_and_agreement/lg-application'
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
        const dataToValidate = {
          file: fileData ? fileData.file : null,
          fileName: fileData ? fileData.name : null,
          branch: this.formModel.get('branch').value,
        }
        this.fileUploadService.validate(dataToValidate).subscribe((result) => {
          if (result['errorCode'] != '0') {
            this.onError(result)
          } else {
            this.validationResponse = result
            this.formModel.disable()
            this.markNextWizardStep()
          }
        })
        break
      case 2:
        const dataToConfirm = {
          file: this.validationResponse.file,
          fileName: this.validationResponse.fileName,
          branch: this.validationResponse.branch,
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
