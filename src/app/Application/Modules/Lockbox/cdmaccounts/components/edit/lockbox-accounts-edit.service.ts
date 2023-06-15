import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionModifyService } from '../../../../Common/Services/Abstract/abstract-action-modify.service'
import { DomSanitizer } from '@angular/platform-browser'

@Injectable()
export class LockboxAccountsEditService extends AbstractActionModifyService {
  validateResponse: any

  constructor(
    protected router: Router,
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
    public sanitizer: DomSanitizer,
  ) {
    super(http, config)
  }

  public configureEditFormModel(detailsData) {
    const _fieldsConfigForForm = []

    _fieldsConfigForForm.push({
      key: 'account',
      title: 'account',
      translate: 'account',
      type: 'hidden',
      required: false,
      default: detailsData,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-3 hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'fullAccountNumber',
      title: 'fullAccountNumber',
      translate: 'fullAccountNumber',
      type: 'span',
      required: false,
      default: detailsData.fullAccountNumber,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      readonly: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'alias',
      title: 'alias',
      translate: 'alias',
      type: 'text',
      required: false,
      default: detailsData.ccdmAlias,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: true,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      maxlength: 50,
    })

    _fieldsConfigForForm.push({
      key: 'logo',
      title: 'logo',
      translate: 'logoUpload',
      type: 'file',
      required: true,
      default: detailsData.logo
        ? {
            name: detailsData.accountLogoUrl,
            file: this.b64toFile(
              detailsData.logo.content,
              detailsData.logo.type,
              detailsData.accountLogoUrl,
            ),
            data: detailsData.logo.content,
            url: detailsData.logo.content,
          }
        : null,
      validators: [],
      readonly: false,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: true,
      accept: '.jpg',
      widget_event_on_change: ($event, field, combosData, formModel) => {
        const value = formModel.get('logo').value
        if (value && value.data) {
          formModel
            .get('logoPreview')
            .setValue(
              this.getTrustedHtml(
                '<img style="width: 150px; height: 150px" src="' +
                  value.data +
                  '">',
              ),
            )
        } else {
          formModel.get('logoPreview').setValue('')
        }
        // name: _file.name,
        // file: _file,
        // data: _reader.result,
        // url: e.target.result
      },
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'logoPreview',
      title: 'logoPreview',
      translate: 'logoPreview',
      type: 'span',
      required: false,
      default: detailsData.logo
        ? this.getTrustedHtml(
            '<img src="data:' +
              detailsData.logo.type +
              ';base64,' +
              detailsData.logo.content +
              '" style="width: 150px; height: 150px">',
          )
        : '',
      validators: [],
      readonly: false,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      widget_control_style: {
        height: 'auto',
      },
    })

    return _fieldsConfigForForm
  }

  protected b64toFile(
    b64Data,
    contentType = '',
    filename = '',
    sliceSize = 512,
  ) {
    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: contentType })
    const file = new File([blob], filename, { type: contentType })
    return file
  }

  protected createValidateRequest(values: any): Observable<any> {
    this.validateResponse = {
      account: values.account,
      alias: values.alias,
      logo: values.logo,
    }

    const params = {}

    return of({
      errorCode: '0',
      result: this.validateResponse,
    })
  }

  protected createConfirmRequest(values: any): Observable<any> {
    // TODO, check this. Param change, now nickName(ccdmAlias) is update inside AccountsDTO and not as  other parameter
    // TODO Endpoint not deployed. To ckeck

    this.validateResponse.account.ccdmAlias = this.validateResponse.alias
    //this.validateResponse.account.logo = null;
    const params = {
      account: this.validateResponse.account,
    }

    const formData = new FormData()

    formData.append('file', this.validateResponse.logo.file)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')

    formData.append('json', JSON.stringify(params))

    return this.http.post(
      this.config.getServicesUrl() +
        '/lockbox/accountManagement/modify/confirm',
      formData,
      { headers },
    )
  }

  back(route: string) {
    this.router.navigate([route])
  }

  getTrustedHtml(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }
}
