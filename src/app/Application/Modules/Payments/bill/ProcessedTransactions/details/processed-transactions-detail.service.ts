import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core';
import { ConfigResourceService } from 'app/core/config/config.resource.local';
import { BillPaymentsBatch } from '../list/processed-transactions.model';
import { TranslateService } from '@ngx-translate/core'
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe';
@Injectable({
  providedIn: 'root'
})
export class ProcessedTransactionsDetailService {
  detailsData: any = {}
  selectedItem: BillPaymentsBatch = null;
  constructor(protected http: HttpClient, 
    public config: ConfigResourceService, 
    protected translate: TranslateService,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
) { }

  public getFieldEntityPropertiesbillProcessTransactions(selectedItem: BillPaymentsBatch): any[] {
    const _getFieldsConfigForList: any[] = []
    _getFieldsConfigForList.push({
      key: 'billerName',
      title: 'billerName',
      translate: 'biller-name',
      type: 'text',
      required: false,
      default: this.translate.currentLang != 'ar' ? selectedItem?.addDescriptionEn : selectedItem?.addDescriptionAr,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,

    })
    _getFieldsConfigForList.push({
      key: 'billRef',
      title: 'billRef',
      translate: 'bill-reference',
      type: 'text',
      required: false,
      default: selectedItem?.billRef,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })
    _getFieldsConfigForList.push({
      key: 'nickName',
      title: 'nickName',
      translate: 'bill-nickName',
      type: 'text',
      required: false,
      default: selectedItem?.nickname,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })
    _getFieldsConfigForList.push({
      key: 'account',
      title: 'account',
      translate: 'processedFile.accnum',
      type: 'text',
      required: false,
      default: selectedItem?.accountNumber,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      append_next_column: true,

    })
    _getFieldsConfigForList.push({
      key: 'accountNickName',
      title: 'accountNickName',
      translate: 'account-nickName',
      type: 'text',
      required: false,
      default: (selectedItem.account?.ccdmAlias)? selectedItem.account?.ccdmAlias : selectedItem?.accountAlias,
      validators: [],
      disabled: true,
      maxlength: 70,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
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
      key: 'PaymentAmount',
      title: 'PaymentAmount',
      translate: 'option',
      type: 'text',
      required: false,
      default: selectedItem?.paymentType,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _getFieldsConfigForList.push({
      key: 'originalAmount',
      title: 'originalAmount',
      translate: 'original-amount',
      type: 'text',
      required: false,
      default: new AmountCurrencyPipe(this.injector, this.locale).transform(
        selectedItem?.amountOriginal,
        null,
      ),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    return _getFieldsConfigForList
  }
}
