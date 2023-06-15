import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { TranslateService } from "@ngx-translate/core";
import { ModelService } from 'app/Application/Components/common/model.service';
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe';
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe';
import { MoiPaymentPipe } from 'app/Application/Components/common/Pipes/moi-payment-type-pipe';
import { ConfigResourceService } from 'app/core/config/config.resource.local';
import { MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS } from '../moi-processed-transactions.form-fields-configs';

@Injectable({
  providedIn: 'root'
})
export class MoiProcessedTransactionsDetailService {
  detailsData: any = {}
  selectedItem: any;
  public initiationTime: string;
  public translate: TranslateService
  private dinamycInput: any[] = []
  moiPaymentType: MoiPaymentPipe

  lang: string

  combosData: any
  MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS: any = MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS

  constructor(protected http: HttpClient,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale:
      string, public modelPipe: ModelPipe,
    public config: ConfigResourceService,
    private modelservice: ModelService) { }

  public getFieldEntityPropertiesMoiProcessTransactions(combosData?: any): any[] {
    const _fieldsConfigForDetailForm: any[] = []

    _fieldsConfigForDetailForm.push({
      key: 'applicationType',
      title: 'moiPayments.payments.applicationType',
      translate: 'moiPayments.payments.subServiceType',
      type: 'text',
      required: false,
      validators: [],
      default: this.modelPipe.transform('eGovApplicationTypeAll', this.selectedItem?.applicationType),
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForDetailForm.push({
      key: 'transactionType',
      title: 'moiPayments.payments.transactionType',
      translate: 'moiPayments.payments.paymentType',
      type: 'text',
      required: false,
      validators: [],
      default: this.selectedItem?.transactionType ? this.getTranslatePaymentType(this.selectedItem?.transactionType) : '',
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForDetailForm.push({
      key: 'serviceType',
      title: 'moiPayments.payments.serviceType',
      translate: 'moiPayments.payments.serviceType',
      type: 'text',
      required: false,
      validators: [],
      default: this.modelPipe.transform('eGovSadadType', this.selectedItem?.serviceType),
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForDetailForm.push({
      key: 'idNumber',
      title: 'idNumber',
      translate: 'idNumber',
      type: 'text',
      required: false,
      disabled: true,
      validators: [],
      default: this.selectedItem?.paymentId,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForDetailForm.push({
      key: 'beneficiaryName',
      title: 'beneficiaryName',
      translate: 'moiPayments.beneficiaryName',
      type: 'text',
      required: false,
      default: this.selectedItem?.beneficiaryName,
      disabled: true,
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForDetailForm.push({
      key: 'account',
      title: 'account',
      translate: 'processedFile.accnum_nickname',
      type: 'text',
      required: false,
      default: this.selectedItem?.accountNumber + " " + this.selectedItem?.accountAlias,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-6',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForDetailForm.push({
      key: 'amount',
      title: 'amount',
      translate: 'amount',
      type: 'text',
      required: false,
      validators: [],
      default: new AmountCurrencyPipe(this.injector, this.locale).transform(
        this.selectedItem?.amount,
        null,
      ),
      disabled: true,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    this.selectedItem.details.forEach(detail => {
      let keySplit = detail.labelKey.split('.')[1];
      const obj = {
        key: keySplit,
        title: keySplit,
        translate: 'moiPayments.' + this.getApiKey(this.selectedItem.serviceType) + keySplit,
        type: 'text',
        required: false,
        validator: [],
        default: (detail.list ? combosData[detail.list].find(result => result.key === detail.value
        )['value'] : detail.value),
        widget: 'text',
        disabled: true,
        widget_container_class: 'col-xs-12 col-sm-3',
        widget_container_init_row: false,
        widget_container_end_row: false
      }
      _fieldsConfigForDetailForm.push(obj)

    });

    _fieldsConfigForDetailForm.push({
      key: 'unusedBalance',
      title: 'unusedBalance',
      translate: 'unusedBalance',
      type: 'text',
      required: false,
      validators: [],
      default: new AmountCurrencyPipe(this.injector, this.locale).transform(
        this.selectedItem?.unusedBalance,
        null,
      ),
      disabled: true,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })

    _fieldsConfigForDetailForm.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'text',
      required: false,
      disabled: true,
      validators: [],
      default: this.selectedItem?.beStatus ?
        this.modelPipe.transform('errors', 'errorTable.' + this.selectedItem?.beStatus) :
        this.injector.get(TranslateService).instant('invoiceHUB.sentTobank'),
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'processTransactionStatus',
    })

    _fieldsConfigForDetailForm.push({
      key: 'initiatedBy',
      title: 'initiatedBy',
      translate: 'moiPayments.payments.initiatedBy',
      type: 'text',
      required: false,
      validators: [],
      default: this.selectedItem?.securityLevelsDTOList[0]?.updater,
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    //Executed By
    _fieldsConfigForDetailForm.push({
      key: 'executedBy',
      title: 'executedBy',
      translate: 'moiPayments.payments.executedBy',
      type: 'text',
      required: false,
      disabled: true,
      validators: [],
      default: this.selectedItem?.securityLevelsDTOList[this.selectedItem.securityLevelsDTOList.length - 1]?.updater,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    return _fieldsConfigForDetailForm
  }


  public getSelectedItem(): any | null {
    return this.selectedItem ? this.selectedItem : null
  }

  public setSelectedItem(itemDetails) {
    this.selectedItem = itemDetails
  }

  getTime(): string {
    const date = new Date(this.selectedItem?.initiationDate)
    const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours()
    const dayPart = date.getHours() > 12 ? 'PM' : 'AM'
    this.initiationTime = `${hours}.${this.fill(
      date.getMinutes(),
    )}.${this.fill(date.getSeconds())} ${dayPart}`
    return this.initiationTime;
  }

  getTotalAmount(fessTotalAmount: any): number {
    let totalAmount = 0.00
    if (fessTotalAmount && fessTotalAmount.length > 0) {
      for (let i = 0; i < fessTotalAmount.length; i++) {
        totalAmount = totalAmount + fessTotalAmount[i].feeAmount
      }
      return +totalAmount;
    } else {
      return +totalAmount;
    }
  }


  private fill(value: number): string {
    if (value < 10) {
      return `0${value}`
    }

    return value.toString()
  }

  /**
   * The serviceType code in list will let take apiKey from hardcoded list on key value:
   * @param serviceType = key
   */
  getApiKey(serviceType: string): string {

    let strApiKey = this.MOI_PROCESSED_TRANSACTIONS_FORMS_FIELDS_CONFIGS[serviceType].apiKey
    strApiKey = strApiKey.substr(0, 1).toLowerCase() + strApiKey.substr(1, strApiKey.length)
    if (strApiKey != "publicViolation") {
      strApiKey = strApiKey + "Services"
    }
    return strApiKey = strApiKey + "."
  }

  getTranslatePaymentType(valuePaymentType: string): string {

    this.lang = this.injector.get(TranslateService).currentLang
    if (valuePaymentType === 'P') {
      return this.injector
        .get(TranslateService)
        .instant('payments.moiPayments.payment')
    } else if (valuePaymentType === 'R') {
      return this.injector
        .get(TranslateService)
        .instant('payments.moiPayments.refund')
    } else {
      return ''
    }
  }


}
