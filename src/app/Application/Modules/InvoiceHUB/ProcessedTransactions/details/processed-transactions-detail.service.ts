import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe';
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe';
import { StatusPipe } from 'app/Application/Components/common/Pipes/status-pipe';
import { ConfigResourceService } from 'app/core/config/config.resource.local';
import { EsalPaymentsBatch } from '../list/processed-transactions.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessedTransactionsDetailService {
  detailsData: any = {}
  selectedItem: EsalPaymentsBatch = null;
  constructor(protected http: HttpClient,
    public modelPipe: ModelPipe,
    public config: ConfigResourceService,
    public statusPipe: StatusPipe,
    protected translate: TranslateService,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
  ) { }

  public getFieldEntityPropertiesEsalProcessTransactions(selectedItem: EsalPaymentsBatch): any[] {
    const _getFieldsConfigForList: any[] = []

    _getFieldsConfigForList.push({
      key: 'invoiceId',
      title: 'invoiceId',
      translate: 'invoiceNumber',
      type: 'text',
      required: false,
      default: selectedItem?.invoiceId,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,

    })
    _getFieldsConfigForList.push({
      key: 'billerId',
      title: 'billerId',
      translate: 'supplierId',
      type: 'text',
      required: false,
      default: selectedItem?.billerId,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })
    _getFieldsConfigForList.push({
      key: 'billerName',
      title: 'billerName',
      translate: 'supplierName',
      type: 'text',
      required: false,
      default: selectedItem?.billerName,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })

    _getFieldsConfigForList.push({
      key: 'buyerName',
      title: 'buyerName',
      translate: 'buyerName',
      type: 'text',
      required: false,
      default: selectedItem?.buyerName,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,

    })
    _getFieldsConfigForList.push({
      key: 'accountNumber',
      title: 'accountNumber',
      translate: 'accountNumber',
      type: 'text',
      required: false,
      default: selectedItem?.accountNumber,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      append_next_column: true,

    })
    _getFieldsConfigForList.push({
      key: 'nickName',
      title: 'nickName',
      translate: 'nickname',
      type: 'text',
      required: false,
      default: selectedItem?.accountAlias,
      validators: [],
      disabled: true,
      maxlength: 70,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    });

    _getFieldsConfigForList.push({
      key: 'amount',
      title: 'amount',
      translate: 'amount',
      type: 'text',
      required: false,
      default: new AmountCurrencyPipe(this.injector, this.locale).transform(
        selectedItem?.amount,
        null,
      ),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })

    _getFieldsConfigForList.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'text',
      required: false,
      // default: this.statusPipe.transform(selectedItem?.status),
      default: this.getStatus(selectedItem),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: true,
    })

    _getFieldsConfigForList.push({
      key: 'initiatedBy',
      title: 'initiatedBy',
      translate: 'initiatedBy',
      type: 'text',
      required: false,
      default: selectedItem?.securityLevelsDTOList[0].updater,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    _getFieldsConfigForList.push({
      key: 'executedBy',
      title: 'executedBy',
      translate: 'executedBy',
      type: 'text',
      required: false,
      default: selectedItem?.pdfSecurityLevelsDTOList[selectedItem?.securityLevelsDTOList.length - 1].updater,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _getFieldsConfigForList.push({
      key: 'notes',
      title: 'notes',
      translate: 'notes',
      type: 'text',
      required: false,
      default: this.translate.currentLang !== 'ar' ? selectedItem?.additionalDetails : selectedItem?.additionalDetailsAr,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: true,
    })

    return _getFieldsConfigForList
  }


  getStatus(item) {
    if (item.beStatus) {
      return new ModelPipe(this.injector).transform('errors', 'errorTable.' + item.beStatus)
    }
    else {
      return this.injector.get(TranslateService).instant('invoiceHUB.sentTobank')
    }
  }
}
