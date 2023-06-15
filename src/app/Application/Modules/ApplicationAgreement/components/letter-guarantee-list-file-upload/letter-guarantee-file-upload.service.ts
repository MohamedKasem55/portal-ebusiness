import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractActionModifyService } from '../../../Common/Services/Abstract/abstract-action-modify.service'
import { TranslateService } from '@ngx-translate/core'

@Injectable()
export class LetterGuaranteeFileUploadService extends AbstractActionModifyService {
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
      key: 'branch',
      title: 'branch',
      translate: 'branchRBS5',
      type: 'select',
      required: true,
      default: '',
      validators: [],
      widget: '',
      select_combo_key: 'branches',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      widget_event_on_change: ($event, field, combosData, formModel) => {
        this.updateFieldsByBranchSelected(formModel)
      },
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

    _fieldsConfigForForm.push({
      key: 'processedMessage',
      title: 'processedMessage',
      translate: 'processedMessage',
      type: 'custom-code',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-12',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
      widget_template_name: 'processedMessage',
    })

    _fieldsConfigForForm.push({
      key: 'branchCity',
      title: 'branchCity',
      translate: 'branchCity',
      type: 'text',
      required: false,
      readonly: true,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'branchContact',
      title: 'branchContact',
      translate: 'branchContact',
      type: 'text',
      required: false,
      readonly: true,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'branchLocation',
      title: 'branchLocation',
      translate: 'branchLocation',
      type: 'textarea',
      required: false,
      readonly: true,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-12',
      widget_container_init_row: true,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    return _fieldsConfigForForm
  }

  public updateFieldsByBranchSelected(formModel) {
    const branch = formModel.get('branch').value
    // console.log(branch);
    if (branch && branch.branchInfo) {
      formModel
        .get('branchCity')
        .setValue(
          this.translate.currentLang != 'ar'
            ? branch.branchInfo.cityEn
            : branch.branchInfo.cityAr,
        )
      formModel
        .get('branchLocation')
        .setValue(
          this.translate.currentLang != 'ar'
            ? branch.branchInfo.locationEn
            : branch.branchInfo.locationAr,
        )
      formModel.get('branchContact').setValue(branch.branchInfo.contactPerson)
    } else {
      formModel.get('branchCity').setValue('')
      formModel.get('branchLocation').setValue('')
      formModel.get('branchContact').setValue('')
    }
  }

  protected createValidateRequest(values: any): Observable<any> {
    this.validateResponse = {
      errorCode: '0',
      file: values.file,
      fileName: values.fileName,
      branch: values.branch,
    }

    /*const formData = new FormData();

        formData.append("file", values.file);
        const headers = new HttpHeaders().set(
            "Content-Type",
            "multipart/form-data"
        );

        const params = formData;

        return this.http
            .post(this.config.getServicesUrl() + '/managementLetterGuarantee/initiator/uploadFile/confirm',
                formData, {headers}).pipe(map((response) => {
                this.validateResponse = response;
                return response;
            }));
         */
    return of(this.validateResponse)
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const formData = new FormData()
    formData.append('json', JSON.stringify(values.file))
    formData.append('file', values.file)
    formData.append('branchRBS5', values.branch.branchRbs5)
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data')
    return this.http.post(
      this.config.getServicesUrl() + '/letterGuarantee/uploadAndSend',
      formData,
      { headers },
    )
  }

  back(route: string) {
    this.router.navigate([route])
  }
}
