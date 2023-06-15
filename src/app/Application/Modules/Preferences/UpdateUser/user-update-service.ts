import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { AbstractActionModifyService } from '../../Common/Services/Abstract/abstract-action-modify.service'
import { FormControl, FormGroup } from '@angular/forms'
import { map } from 'rxjs/operators'

@Injectable({ providedIn: 'root' })
export class UserUpdateService extends AbstractActionModifyService {
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
    // console.log("detailsData", detailsData);

    const _fieldsConfigForForm = []

    _fieldsConfigForForm.push({
      key: 'mail',
      title: 'mail',
      translate: 'email',
      type: 'text',
      required: true,
      default: detailsData.email,
      validators: [this.mailFormat],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      maxlength: 50,
      inputPattern: 'notArabic',
      widget_event_on_change: (
        $event,
        field,
        combosData,
        formModel: FormGroup,
      ) => {
        const repeatMailValue = formModel.get('repeatMail').value
        formModel.get('repeatMail').setValue(null, { emitEvent: true })
        formModel.get('repeatMail').updateValueAndValidity()
        formModel
          .get('repeatMail')
          .setValue(repeatMailValue, { emitEvent: true })
        formModel.get('repeatMail').updateValueAndValidity()
      },
    })

    _fieldsConfigForForm.push({
      key: 'repeatMail',
      title: 'repeatMail',
      translate: 'confirmEmail',
      type: 'text',
      required: true,
      default: detailsData.email,
      validators: [this.mailFormat, this.validateEmailConfirm],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      maxlength: 50,
      inputPattern: 'notArabic',
    })

    _fieldsConfigForForm.push({
      key: 'preferedLanguage',
      title: 'preferedLanguage',
      translate: 'preferedLanguage',
      type: 'select',
      required: true,
      default: detailsData.preferedLanguage,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: true,
      select_combo_key: 'languages',
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'userImageUpdated',
      title: 'userImageUpdated',
      translate: 'userImageUpdated',
      type: 'hidden',
      required: false,
      default: false,
      validators: [],
      readonly: false,
      widget: '',
      widget_container_class: 'hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'userImage',
      title: 'userImage',
      translate: 'userImageUpload',
      type: 'file',
      required: false,
      default: detailsData.userImage
        ? {
            name: '-----',
            file: false,
            data: detailsData.userImage,
            url: detailsData.userImage,
          }
        : null,
      validators: [],
      readonly: false,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: true,
      accept: '.jpg',
      widget_event_on_change: ($event, field, combosData, formModel) => {
        formModel.get('userImageUpdated').setValue(true)
        const value = formModel.get('userImage').value
        if (value && value.data) {
          formModel
            .get('userImagePreview')
            .setValue(
              this.getTrustedHtml(
                '<img style="width: 50px; height: 50px" src="' +
                  value.data +
                  '">',
              ),
            )
        } else {
          formModel.get('userImagePreview').setValue(null)
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
      key: 'userImagePreview',
      title: 'userImagePreview',
      translate: 'userImagePreview',
      type: 'span',
      required: false,
      // default: detailsData.userImage ? this.getTrustedHtml('<img src="data:' + detailsData.userImage.type + ';base64,' + detailsData.userImage.content + '" style="width: 50px; height: 50px">') : '',
      default: detailsData.userImage
        ? this.getTrustedHtml(
            '<img src="' +
              detailsData.userImage +
              '" style="width: 50px; height: 50px">',
          )
        : '',
      validators: [],
      readonly: false,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
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

  protected createValidateRequest(values: any): Observable<any> {
    let params: any = {}
    if (values) {
      params = {
        mail: values.mail,
        repeatMail: values.repeatMail,
        language: values.preferedLanguage,
        uploadImage: values.userImageUpdated,
        image:
          values.userImageUpdated && values.userImage && values.userImage.data
            ? values.userImage.data
            : null,
      }
    }

    this.validateResponse = params
    return of({
      errorCode: '0',
      result: this.validateResponse,
    })

    // return this.http
    //     .post(
    //         this.servicesUrl +
    //         '/userManagement/confirm',
    //         params,
    //     )
    //     .pipe(
    //         map((response) => {
    //             this.validateResponse = response
    //             return response
    //         }),
    //     )
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const params = this.validateResponse
    return this.http.post(
      this.config.getServicesUrl() + '/userProfile/updateDetails',
      //'/userProfile/updateMail',
      params,
    )
  }

  back(route: string) {
    this.router.navigate([route])
  }

  getTrustedHtml(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }

  validControl(control: FormControl) {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return false
    }
    return true
  }

  validateEmailConfirm(control: FormControl) {
    if (
      control.parent === undefined ||
      control.parent.controls['repeatMail'] === undefined ||
      control.parent.controls['repeatMail'] === '' ||
      control.parent.controls['repeatMail'].value === null ||
      control.parent.controls['repeatMail'].value === undefined ||
      control.parent.controls['mail'] === undefined ||
      control.parent.controls['mail'] === '' ||
      control.parent.controls['mail'].value === null ||
      control.parent.controls['mail'].value === undefined
    ) {
      return null
    }

    if (
      control.parent.controls['repeatMail'].value !==
      control.parent.controls['mail'].value
    ) {
      return { emailMatch: true }
    }
    return null
  }

  mailFormat(control: FormControl): any {
    const EMAIL_REGEXP =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (
      control.value &&
      control.value != '' &&
      (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
    ) {
      return { incorrectMailFormat: true }
    }
    return null
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

  public getUserDetails(userId: string): Observable<any> {
    return (
      this.http
        .get(`${this.servicesUrl}/userProfile/getDetails`)
        //.get(`${this.servicesUrl}/userManagement/details/${userId}`)
        .pipe((resp) => resp)
    )
  }
}
