import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Observable } from 'rxjs'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'
import { Validators } from '@angular/forms'

@Injectable()
export class TransferReactivationService {
  currentTransferDetailType: string
  currentTransactionDetailInformation: any[]

  constructor(
    public http: HttpClient,
    public config: ConfigResourceService,
    @Inject(LOCALE_ID) private _locale: string,
    private injector: Injector,
  ) {
    new ModelPipe(this.injector).transform('bankCode', null)
    new ModelPipe(this.injector).transform('currency', null)
    new ModelPipe(this.injector).transform('currencyIso', null)
    new ModelPipe(this.injector).transform('backEndCountryCode', null)
  }

  getTransformedModelValue(modelKey, modelValue) {
    if (!modelValue || modelValue === '') {
      return modelValue
    }
    const result = new ModelPipe(this.injector).transform(modelKey, modelValue)
    if (!result) {
      return modelValue
    }
    if (
      (result.constructor.name === 'string' ||
        result.constructor.name === 'String') &&
      (result as string).startsWith('???.')
    ) {
      return modelValue
    }
    return result
  }

  getLocalDynamicFormFields(batch, beneficiary) {
    //console.log("batch", batch);
    //console.log("beneficiary", beneficiary);
    return [
      {
        key: 'accountTo',
        title: 'accountTo',
        translate: 'accountTo',
        type: 'text',
        required: false,
        default: batch['accountTo'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'beneficiaryName',
        title: 'beneficiaryName',
        translate: 'feedback.beneficiaryName',
        type: 'text',
        required: false,
        default: beneficiary ? beneficiary['name'] : batch['beneficiary'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'bankName',
        title: 'bankName',
        translate: 'bankName',
        type: 'text',
        required: false,
        default: this.getTransformedModelValue(
          'bankCode',
          batch['bankName'] ? batch['bankName'] : '080',
        ),
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      // -----------------------------
      {
        key: 'accountFrom',
        title: 'accountFrom',
        translate: 'accountFrom',
        type: 'select',
        required: true,
        default: batch['accountNumber'],
        validators: [],
        select_combo_key: 'accounts',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-5',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'amount',
        title: 'amount',
        translate: 'amount',
        type: 'text',
        required: true,
        default: parseFloat(batch['amount'] ? batch['amount'] : 0).toFixed(2),
        validators: [],
        widget: '',
        inputPattern: 'onlyFormattedPositiveDecimalNumbers',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'remarks',
        title: 'remarks',
        translate: 'remarks',
        type: 'text',
        required: false,
        default: batch['remarks'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'transferReason',
        title: 'transferReason',
        translate: 'purpose',
        type: 'select',
        required: true,
        default: batch['transferReason'],
        validators: [],
        widget: '',
        select_combo_key: 'transferReasons',
        widget_container_class: 'col-xs-12 col-sm-5',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'email',
        title: 'email',
        translate: 'email',
        type: 'text',
        required: false,
        default: beneficiary ? beneficiary['email'] : batch['email'],
        validators: [Validators.email],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'rejectedReason',
        title: 'rejectedReason',
        translate: 'rejectedReason',
        type: 'text',
        required: false,
        default: batch['rejectedReason'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      // -------------------------------
      {
        key: 'currency',
        title: 'currency',
        translate: 'currency',
        type: 'select',
        required: false,
        default: batch['currency'],
        validators: [],
        select_combo_key: 'currency', // currencyIso
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      /*{
                "key": "batchPk",
                "title": "batchPk",
                "translate": "batchPk",
                "type": "hidden",
                "required": false,
                "default": batch["batchPk"],
                "validators": [],
                "widget": "",
                "widget_container_class": "col-xs-12 col-sm-3 hidden",
                "widget_container_init_row": false,
                "widget_container_end_row": false,
            },*/
      {
        key: 'accountNumberTo',
        title: 'accountNumberTo',
        translate: 'accountNumberTo',
        type: 'hidden',
        required: false,
        default: batch['accountNumberTo'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
    ]
  }

  getAlrahjiDynamicFormFields(batch, beneficiary, accounts) {
    //console.log("batch", batch);
    //console.log("beneficiary", beneficiary);
    return [
      {
        key: 'accountTo',
        title: 'accountTo',
        translate: 'accountTo',
        type: 'text',
        required: false,
        default: batch['accountTo'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'beneficiaryName',
        title: 'beneficiaryName',
        translate: 'feedback.beneficiaryName',
        type: 'text',
        required: false,
        default: beneficiary ? beneficiary['name'] : batch['beneficiary'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'bankName',
        title: 'bankName',
        translate: 'bankName',
        type: 'text',
        required: false,
        default: this.getTransformedModelValue(
          'bankCode',
          batch['bankName'] ? batch['bankName'] : '080',
        ),
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      // -----------------------------
      {
        key: 'accountFrom',
        title: 'accountFrom',
        translate: 'accountFrom',
        type: 'select',
        required: true,
        default: batch['accountNumber'],
        validators: [],
        select_combo_key: 'accounts',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-5',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'amount',
        title: 'amount',
        translate: 'amount',
        type: 'text',
        required: true,
        default: parseFloat(batch['amount'] ? batch['amount'] : 0).toFixed(2),
        validators: [],
        widget: '',
        inputPattern: 'onlyFormattedPositiveDecimalNumbers',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'remarks',
        title: 'remarks',
        translate: 'remarks',
        type: 'text',
        required: false,
        default: batch['remarks'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'email',
        title: 'email',
        translate: 'email',
        type: 'text',
        required: true,
        default: beneficiary ? beneficiary['email'] : batch['email'],
        validators: [Validators.email],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-5',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'rejectedReason',
        title: 'rejectedReason',
        translate: 'rejectedReason',
        type: 'text',
        required: false,
        default: batch['rejectedReason'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      // -------------------------------
      {
        key: 'currency',
        title: 'currency',
        translate: 'currency',
        type: 'select',
        required: false,
        default: batch['currency'],
        validators: [],
        select_combo_key: 'currency', // currencyIso
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      /*{
                "key": "batchPk",
                "title": "batchPk",
                "translate": "batchPk",
                "type": "hidden",
                "required": false,
                "default": batch["batchPk"],
                "validators": [],
                "widget": "",
                "widget_container_class": "col-xs-12 col-sm-3 hidden",
                "widget_container_init_row": false,
                "widget_container_end_row": false,
            },*/
      {
        key: 'accountNumberTo',
        title: 'accountNumberTo',
        translate: 'accountNumberTo',
        type: 'hidden',
        required: false,
        default: batch['accountTo'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
    ]
  }

  getInternationalDynamicFormFields(batch, beneficiary, accounts) {
    //console.log("batch", batch);
    //console.log("beneficiary", beneficiary);
    return [
      {
        key: 'accountTo',
        title: 'accountTo',
        translate: 'accountTo',
        type: 'text',
        required: false,
        default: batch['accountTo'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'beneficiaryName',
        title: 'beneficiaryName',
        translate: 'feedback.beneficiaryName',
        type: 'text',
        required: false,
        default: beneficiary ? beneficiary['name'] : batch['beneficiary'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'bankName',
        title: 'bankName',
        translate: 'bankName',
        type: 'text',
        required: false,
        default: this.getTransformedModelValue(
          'bankCode',
          batch['bankName'] ? batch['bankName'] : '080',
        ),
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'country',
        title: 'country',
        translate: 'country',
        type: 'select',
        required: false,
        default: batch['countrybe'],
        validators: [],
        readonly: true,
        select_combo_key: 'backEndCountryCode',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      // -----------------------------
      {
        key: 'accountFrom',
        title: 'accountFrom',
        translate: 'accountFrom',
        type: 'select',
        required: true,
        default: batch['accountNumber'],
        validators: [],
        select_combo_key: 'accounts',
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-5',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'remarks',
        title: 'remarks',
        translate: 'remarks',
        type: 'text',
        required: false,
        default: batch['remarks'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'amount',
        title: 'amount',
        translate: 'amount',
        type: 'text',
        required: true,
        default: parseFloat(batch['amount'] ? batch['amount'] : 0).toFixed(2),
        validators: [],
        widget: '',
        inputPattern: 'onlyFormattedPositiveDecimalNumbers',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'currency',
        title: 'currency',
        translate: 'currency',
        type: 'select',
        required: true,
        default: batch['currency'],
        validators: [],
        select_combo_key: 'currency', // currencyIso
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'email',
        title: 'email',
        translate: 'email',
        type: 'text',
        required: true,
        default: beneficiary ? beneficiary['email'] : batch['email'],
        validators: [Validators.email],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-5',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'transferReason',
        title: 'transferReason',
        translate: 'purpose',
        type: 'select',
        required: true,
        default: batch['transferReason'],
        validators: [],
        widget: '',
        select_combo_key: 'transferReasons',
        widget_container_class: 'col-xs-12 col-sm-5',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'rejectedReason',
        title: 'rejectedReason',
        translate: 'rejectedReason',
        type: 'text',
        required: false,
        default: batch['rejectedReason'],
        validators: [],
        readonly: true,
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      // -------------------------------
      {
        key: 'transferReasonLbl',
        title: 'transferReasonLbl',
        translate: 'transferReasonLbl',
        type: 'hidden',
        required: false,
        default: batch['transferReasonLbl'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'additionalInfoFlag',
        title: 'additionalInfoFlag',
        translate: 'additionalInfoFlag',
        type: 'hidden',
        required: false,
        default: batch['additionalInfoFlag'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'additionalInfo1',
        title: 'additionalInfo1',
        translate: 'additionalInfo1',
        type: 'hidden',
        required: false,
        default: batch['additionalInfo1'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'additionalInfo1Lbl',
        title: 'additionalInfo1Lbl',
        translate: 'additionalInfo1Lbl',
        type: 'hidden',
        required: false,
        default: batch['additionalInfo1Lbl'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'additionalInfo2',
        title: 'additionalInfo2',
        translate: 'additionalInfo2',
        type: 'hidden',
        required: false,
        default: batch['additionalInfo2'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'additionalInfo2Lbl',
        title: 'additionalInfo2Lbl',
        translate: 'additionalInfo2Lbl',
        type: 'hidden',
        required: false,
        default: batch['additionalInfo2Lbl'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      {
        key: 'payType',
        title: 'payType',
        translate: 'payType',
        type: 'hidden',
        required: false,
        default: batch['payType'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
      /*{
                "key": "batchPk",
                "title": "batchPk",
                "translate": "batchPk",
                "type": "hidden",
                "required": false,
                "default": batch["batchPk"],
                "validators": [],
                "widget": "",
                "widget_container_class": "col-xs-12 col-sm-3 hidden",
                "widget_container_init_row": false,
                "widget_container_end_row": false,
            },*/
      {
        key: 'accountNumberTo',
        title: 'accountNumberTo',
        translate: 'accountNumberTo',
        type: 'hidden',
        required: false,
        default: batch['accountTo'],
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-3 hidden',
        widget_container_init_row: false,
        widget_container_end_row: false,
      },
    ]
  }

  // ------------------------------------------------------------

  getLocalTransferDetails(values): Observable<any> {
    const data = {
      batchList: values,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/request/local/details',
      data,
    )
  }

  createLocalValidateRequest(values): Observable<any> {
    const data = {
      listBeneficiaries: values['listBeneficiaries'],
      listTransfersLocal: values['listTransfersLocal'],
      operationDate: values['operationDate'],
      remitterCategory: values['remitterCategory'],
      segment: values['segment'],
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/local/validate',
      data,
    )
  }

  createLocalConfirmRequest(values): Observable<any> {
    const data = {
      batchList: values['batchList'],
      emailChecked: false,
      requestValidate: values['requestValidate'],
      totalAmountProcess: values['totalAmountProcess'],
      typeBatchList: values['typeBatchList'],
      listbatchToDelete: values['listbatchToDelete'],
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/local/confirm',
      data,
    )
  }

  createLocalDeleteRequest(values): Observable<any> {
    const data = {
      batchList: values,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/request/local/delete',
      data,
    )
  }

  // ------------------------------------------------------------

  getAlrahjiTransferDetails(values): Observable<any> {
    const data = {
      batchList: values,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/request/within/details',
      data,
    )
  }

  createWithinValidateRequest(values): Observable<any> {
    const data = {
      listBeneficiaries: values['listBeneficiaries'],
      listTransfersWithn: values['listTransfersWithn'],
      operationDate: values['operationDate'],
      remitterCategory: values['remitterCategory'],
      segment: values['segment'],
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/within/validate',
      data,
    )
  }

  createWithinConfirmRequest(values): Observable<any> {
    const data = {
      batchList: values['batchList'],
      emailChecked: false,
      typeBatchList: values['typeBatchList'],
      requestValidate: values['requestValidate'],
      totalAmountProcess: values['totalAmountProcess'],
      listbatchToDelete: values['listbatchToDelete'],
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/within/confirm',
      data,
    )
  }

  createWithinDeleteRequest(values): Observable<any> {
    const data = {
      batchList: values,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/request/within/delete',
      data,
    )
  }

  // ------------------------------------------------------------

  getInternationalTransferDetails(values): Observable<any> {
    const data = {
      batchList: values,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/request/international/details',
      data,
    )
  }

  createInternationalValidateRequest(values): Observable<any> {
    const data = {
      listBeneficiaries: values['listBeneficiaries'],
      transferIntList: values['transferIntList'],
      operationDate: values['operationDate'],
      remitterCategory: values['remitterCategory'],
      segment: values['segment'],
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/international/validate',
      data,
    )
  }

  createInternationalConfirmRequest(values): Observable<any> {
    const data = {
      batchList: values['batchList'],
      emailChecked: false,
      requestValidate: values['requestValidate'],
      totalAmountProcess: values['totalAmountProcess'],
      typeBatchList: values['typeBatchList'],
      listbatchToDelete: values['listbatchToDelete'],
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/international/confirm',
      data,
    )
  }

  createInternationalDeleteRequest(values): Observable<any> {
    const data = {
      batchList: values,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/transfers/request/international/delete',
      data,
    )
  }
}
