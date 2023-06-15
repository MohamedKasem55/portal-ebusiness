import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { AbstractActionDetailsService } from '../../../Common/Services/Abstract/abstract-action-details.service'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { TranslateService } from '@ngx-translate/core'
import { Validators } from '@angular/forms'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { catchError, map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'
import { DatePipe } from '@angular/common'

@Injectable()
export class LockboxTerminalsDetailsService extends AbstractActionDetailsService {
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
      key: 'terminalID',
      title: 'terminalID',
      translate: 'terminalID',
      type: 'text',
      required: true,
      default: detailsData.terminalID,
      validators: [Validators.required],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'terminalName',
      title: 'terminalName',
      translate: 'terminalName',
      type: 'text',
      required: true,
      default: detailsData.terminalName,
      validators: [Validators.required],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'region',
      title: 'region',
      translate: 'region',
      type: 'text',
      required: false,
      default: detailsData.site.regionName,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'city',
      title: 'city',
      translate: 'city',
      type: 'text',
      required: false,
      default: detailsData.site.cityName,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'location1',
      title: 'location1',
      translate: 'location1',
      type: 'text',
      required: false,
      default: detailsData.site.location1,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'location2',
      title: 'location2',
      translate: 'location2',
      type: 'text',
      required: false,
      default: detailsData.site.location2,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'defaultAccount',
      title: 'defaultAccount',
      translate: 'defaultAccount',
      type: 'text',
      required: true,
      default: detailsData.defaultAccount.fullAccountNumber,
      validators: [Validators.required],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'chargeAccount',
      title: 'chargeAccount',
      translate: 'chargeAccount',
      type: 'text',
      required: true,
      default: detailsData.chargeAccount.fullAccountNumber,
      validators: [Validators.required],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'select',
      required: false,
      default: detailsData.status,
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      select_combo_key: 'lockBoxTerminalStatus',
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'deliveryDate',
      title: 'deliveryDate',
      translate: 'deliveryDate',
      type: 'date',
      required: false,
      default: detailsData.machine.deliveryDate
        ? new DateFormatPipe(this.injector, this._locale).transform(
            detailsData.machine.deliveryDate,
            'dd/MM/yyyy',
          )
        : '',
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'cassetesNumber',
      title: 'cassetesNumber',
      translate: 'cassetesNumber',
      type: 'text',
      required: false,
      default: detailsData.machine.cassetesNumber,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      inputPattern: 'onlyPositiveNumbers',
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'modelNumber',
      title: 'modelNumber',
      translate: 'modelNumber',
      type: 'text',
      required: false,
      default: detailsData.machine.modelNumber,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'maxCapacity',
      title: 'maxCapacity',
      translate: 'maxCapacity',
      type: 'text',
      required: false,
      default: detailsData.machine.maxCapacity,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      inputPattern: 'onlyPositiveNumbers',
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'manufacturer',
      title: 'manufacturer',
      translate: 'manufacturer',
      type: 'text',
      required: false,
      default: detailsData.machine.manufacturer,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'gpsCoordinatesN',
      title: 'gpsCoordinatesN',
      translate: 'gpsCoordinatesN',
      type: 'text',
      required: false,
      default: detailsData.site.gpsCoordinatesN,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'gpsCoordinatesE',
      title: 'gpsCoordinatesE',
      translate: 'gpsCoordinatesE',
      type: 'text',
      required: false,
      default: detailsData.site.gpsCoordinatesE,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'storeNumber',
      title: 'storeNumber',
      translate: 'storeNumber',
      type: 'text',
      required: false,
      default: detailsData.site.storeNumber,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: true,
      inputPattern: 'onlyPositiveDecimalNumbers',
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'contactName1',
      title: 'contactName1',
      translate: 'contactName1',
      type: 'text',
      required: false,
      default: detailsData.site.contactName1,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'contactNumber1',
      title: 'contactNumber1',
      translate: 'contactNumber1',
      type: 'text',
      required: false,
      default: detailsData.site.contactNumber1,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      inputPattern: 'onlyPositiveDecimalNumbers',
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'contactName2',
      title: 'contactName2',
      translate: 'contactName2',
      type: 'text',
      required: false,
      default: detailsData.site.contactName2,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'contactNumber2',
      title: 'contactNumber2',
      translate: 'contactNumber2',
      type: 'text',
      required: false,
      default: detailsData.site.contactNumber2,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
      inputPattern: 'onlyPositiveDecimalNumbers',
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'contactName3',
      title: 'contactName3',
      translate: 'contactName3',
      type: 'text',
      required: false,
      default: detailsData.site.contactName3,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })
    _fieldsConfigForForm.push({
      key: 'contactNumber3',
      title: 'contactNumber3',
      translate: 'contactNumber3',
      type: 'text',
      required: false,
      default: detailsData.site.contactName3,
      validators: [],
      widget: 'text',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      inputPattern: 'onlyPositiveDecimalNumbers',
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    return _fieldsConfigForForm
  }

  protected createInitRequest(): Observable<any> {
    return undefined
  }

  protected createDetailRequest(values: any): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/lockbox/terminal/' + values.terminalID)
      .pipe(
        map((response: any) => {
          return response
        }),
        catchError(this.handleError),
      )
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
