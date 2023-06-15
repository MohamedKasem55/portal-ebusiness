import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionDetailsService } from '../../../../Common/Services/Abstract/abstract-action-details.service'
import { DatePipe } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
import { DomSanitizer } from '@angular/platform-browser'

@Injectable()
export class LockboxAccountsDetailsService extends AbstractActionDetailsService {
  detailsData: any = {}

  constructor(
    protected translate: TranslateService,
    protected router: Router,
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected dateService: DatePipe,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
    public sanitizer: DomSanitizer,
  ) {
    super(http, config)
  }

  public configureDetailsFormModel(detailsData) {
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

    /*
        _fieldsConfigForForm.push({
            key: 'file',
            title: 'file',
            translate: 'logo',
            type: 'file',
            required: false,
            default: detailsData.logo,
            validators: [],
            readonly: false,
            widget: '',
            widget_container_class: 'col-xs-12 col-sm-6',
            widget_container_init_row: true,
            widget_container_end_row: true,
            accept: '.jpg',
        })
        */

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
              '" style="width: 250px; height: 250px">',
          )
        : '',
      validators: [],
      readonly: false,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: true,
      widget_container_end_row: true,
    })

    return _fieldsConfigForForm
  }

  protected createInitRequest(): Observable<any> {
    return undefined
  }

  protected createDetailRequest(values: any): Observable<any> {
    const params = {}

    this.detailsData = values
    return of({
      account: values,
    })
  }

  getSelectedItemDetailsData() {
    return this.detailsData
  }

  back(route: string) {
    this.router.navigate([route])
  }

  getTrustedHtml(str) {
    return this.sanitizer.bypassSecurityTrustHtml(str)
  }
}
