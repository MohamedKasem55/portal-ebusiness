import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractActionModifyService } from '../../../Common/Services/Abstract/abstract-action-modify.service'
import { TranslateService } from '@ngx-translate/core'

@Injectable()
export class PayrollAgreementFileUploadService extends AbstractActionModifyService {
  validateResponse: any

  constructor(
    protected router: Router,
    protected http: HttpClient,
    public config: ConfigResourceService,
    public translate: TranslateService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super(http, config)
  }

  public getFieldsConfigForForm(): any[] {
    const _fieldsConfigForForm: any[] = []

    _fieldsConfigForForm.push({
      key: 'region',
      title: 'region',
      translate: 'region',
      type: 'select',
      required: true,
      default: '',
      validators: [],
      widget: '',
      select_combo_key: 'regions',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'file',
      title: 'file',
      translate: 'uploadFile',
      type: 'file',
      required: true,
      default: '',
      validators: [],
      widget: '',
      widget_file_accept: '.pdf',
      widget_container_class: 'col-xs-12 col-sm-8',
      widget_container_init_row: false,
      widget_container_end_row: true,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      widget_event_on_change: ($event, field, combosData, formModel) => {
        // const file = formModel.get('file').value;
        // console.log(file);
        // console.log(file.name);
        // console.log(file.file);
        // console.log(file.data);
        // console.log(file.url);
      },
    })

    return _fieldsConfigForForm
  }

  protected createValidateRequest(values: any): Observable<any> {
    this.validateResponse = {
      errorCode: '0',
      file: values.file,
      fileName: values.fileName,
      region: values.region,
    }

    return of(this.validateResponse)
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const formData = new FormData()
    formData.append('json', JSON.stringify(values.file))
    formData.append('file', values.file)
    formData.append('region', values.region)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')
    return this.http.post(
      this.config.getServicesUrl() + '/payrollCards/uploadAndSend',
      formData,
      { headers },
    )
  }

  back(route: string) {
    this.router.navigate([route])
  }

  public regions(): Observable<any> {
    const data: any = {}
    data.name = 'payrollRegion' //"currencyIso"//
    return this.http.post(this.servicesUrl + '/statics/model', data)
  }
}
