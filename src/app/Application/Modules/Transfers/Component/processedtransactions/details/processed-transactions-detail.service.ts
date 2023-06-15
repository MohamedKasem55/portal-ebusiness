import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe';
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe';
import { PaymentPipe } from 'app/Application/Components/common/Pipes/paymenttype-pipe';
import { StatusPipe } from 'app/Application/Components/common/Pipes/status-pipe';
import { Exception } from 'app/Application/Model/exception';
import { EsalPaymentsBatch } from 'app/Application/Modules/InvoiceHUB/ProcessedTransactions/list/processed-transactions.model';
import { ConfigResourceService } from 'app/core/config/config.resource.local';
import { catchError, map } from 'rxjs/operators';
import { throwError as observableThrowError } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ProcessedTransactionsDetailService {
  detailsData: any = {}
  selectedItem: EsalPaymentsBatch = null;
  servicesUrl: string;

  constructor(protected http: HttpClient,
    public modelPipe: ModelPipe,
    public config: ConfigResourceService,
    public statusPipe: StatusPipe,
    protected translate: TranslateService,
    protected datePipe: DatePipe,
    private injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,

  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  public getFieldEntityPropertiesEsalProcessTransactions(selectedItem: any): any[] {
    const _getFieldsConfigForList: any[] = []
    const decimalPipe = new DecimalPipe(this._locale)

    _getFieldsConfigForList.push({
      key: 'paymentType',
      title: 'paymentType',
      translate: 'paymentType',
      type: 'text',
      required: false,
      default: new PaymentPipe(this.injector).transform(selectedItem?.transferType),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,

    })
    _getFieldsConfigForList.push({
      key: 'beneficiary',
      title: 'beneficiary',
      translate: 'beneficiary',
      type: 'text',
      required: false,
      default: selectedItem?.beneficiaryName,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })
    _getFieldsConfigForList.push({
      key: 'beneficiaryAccount',
      title: 'beneficiaryAccount',
      translate: 'beneficiaryAccount',
      type: 'text',
      required: false,
      default: selectedItem?.beneficiaryAccount,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })

    _getFieldsConfigForList.push({
      key: 'beneficiaryBankCode',
      title: 'beneficiaryBankCode',
      translate: 'beneficiaryBankCode',
      type: 'text',
      required: false,
      default: selectedItem?.beneficiaryBank,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,

    })
    _getFieldsConfigForList.push({
      key: 'country',
      title: 'country',
      translate: 'country',
      type: 'text',
      required: false,
      default: new ModelPipe(this.injector).transform('backEndCountryCode', selectedItem.country),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      append_next_column: true,

    })
    _getFieldsConfigForList.push({
      key: 'debitAccount',
      title: 'debitAccount',
      translate: 'debitAccount',
      type: 'text',
      required: false,
      default: selectedItem?.accountFrom.fullAccountNumber,
      validators: [],
      disabled: true,
      maxlength: 70,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    });

    _getFieldsConfigForList.push({
      key: 'accountNickname',
      title: 'accountNickname',
      translate: 'accountNickname',
      type: 'text',
      required: false,
      default: selectedItem?.accountFrom.alias,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })

    _getFieldsConfigForList.push({
      key: 'debitAmount',
      title: 'debitAmount',
      translate: 'debitAmount',
      type: 'text',
      required: false,
      default: new AmountCurrencyPipe(this.injector, this._locale).transform(
        selectedItem.sarAmount ? selectedItem.sarAmount : 0,
        null,
      ) + " " + new ModelPipe(this.injector).transform(
        'currencyIso',
        '608',
      ),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })

    _getFieldsConfigForList.push({
      key: 'transferAmount',
      title: 'transferAmount',
      translate: 'transferAmount',
      type: 'text',
      required: false,
      default: new AmountCurrencyPipe(this.injector, this._locale).transform(
        selectedItem.amount ? selectedItem.amount : 0,
        null,
      ) + " " + new ModelPipe(this.injector).transform(
        'currencyIso',
        selectedItem.currency,
      ),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })

    _getFieldsConfigForList.push({
      key: 'fees',
      title: 'fees',
      translate: 'fees',
      type: 'text',
      required: false,
      default: new AmountCurrencyPipe(this.injector, this._locale).transform(
        selectedItem.feesAmount ? selectedItem.feesAmount : 0,
        null,
      ) + " " + new ModelPipe(this.injector).transform(
        'currencyIso',
        selectedItem.feesCurrency,
      ),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,

    })

    _getFieldsConfigForList.push({
      key: 'exchangeRate',
      title: 'exchangeRate',
      translate: 'exchangeRate',
      type: 'text',
      required: false,
      default: decimalPipe.transform(selectedItem.exchangeRate, '1.4-6'),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
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
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
    })

    _getFieldsConfigForList.push({
      key: 'initiatedBy',
      title: 'initiatedBy',
      translate: 'initiationDateBy',
      type: 'text',
      required: false,
      default: selectedItem?.initiatedBy,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    _getFieldsConfigForList.push({
      key: 'initiationDate',
      title: 'initiationDate',
      translate: 'datetime',
      type: 'text',
      required: false,
      default: this.datePipe.transform(selectedItem?.initiationDate, 'dd-MM-yyyy HH:mm'),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _getFieldsConfigForList.push({
      key: 'executedBy',
      title: 'executedBy',
      translate: 'approvalDateBy',
      type: 'text',
      required: false,
      default: selectedItem?.approvedBy,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _getFieldsConfigForList.push({
      key: 'initiationDate',
      title: 'initiationDate',
      translate: 'datetime',
      type: 'text',
      required: false,
      default: this.datePipe.transform(selectedItem?.approvedDate, 'dd-MM-yyyy HH:mm'),
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
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

  getTransferDetails(transfer: any) {
    const data = {
      batchList: [
        transfer
      ]
    }
    return this.http
      .post(this.servicesUrl + '/transfers/processedTransaction/details', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
              response.generateChallengeAndOTP,
            )
            return exception
          } else {
            let output: any
            switch (transfer.transferType) {
              case "1":
                output = response.withinTransfers[0];
                output.errorCode = response.errorCode;
                return output;
              case "2":
                output = response.localTransfers[0];
                output.errorCode = response.errorCode;
                return output;
              case "3":
                output = response.internationalTransfers[0];
                output.errorCode = response.errorCode;
                return output;
              default:
                break;
            }

            return response
          }
        }),
        catchError(this.handleError),
      )
  }
}
