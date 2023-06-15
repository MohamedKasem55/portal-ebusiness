import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'
import { Account } from '../../../Model/account'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
// Model
import { ModelStatement } from '../Model/accounts-statement.model'

@Injectable()
export class CurrentAccountsService {
  servicesUrl: string
  dateFormat = 'yyyy-MM-dd'
  requestedCombos: any[]

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private router: Router,
    private dateFormatPipe: DateFormatPipe,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getResults(
    order: string,
    orderType: string,
    page: number,
    rows: number,
    txType: string,
    filters = null,
  ): Observable<PagedData<Account>> {
    //console.log(filters);
    let data = {}
    if (filters == null) {
      data = { order, orderType, page, rows, txType }
    } else {
      data = {
        order,
        orderType,
        page,
        rows,
        txType,
        accountNickname: filters.accountNickname,
        accountNumber: filters.accountNumber,
        branchid: filters.branchid,
        currency: filters.currency,
        search: filters.search,
      }
    }
    //const body = JSON.stringify(data);
    //
    return this.http.post(this.servicesUrl + '/accounts', data).pipe(
      map((response: any) => {
        //
        const pagedData = new PagedData<Account>()

        const pageObject = new Page()

        pageObject.pageNumber = page
        pageObject.pageSize = rows
        pageObject.size = response.size
        pageObject.totalElements = response.total
        pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

        const size = response.size

        for (let _i = 0; _i < size; _i++) {
          const jsonObj = response.listAccount[_i]

          pagedData.data.push(jsonObj as Account)
        }
        pagedData.page = pageObject
        pagedData['totalBalance'] = response.totalBalance
        pagedData['currencyBalance'] = response.currencyBalance
        pagedData['customerName'] =
          typeof response.customerName !== 'undefined'
            ? response.customerName
            : ''

        return pagedData
      }),
    )
  }

  public getAccounts(txType: string): Observable<Array<Account>> {
    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 100,
      txType,
    }

    const body = JSON.stringify(data)
    return this.http.post(this.servicesUrl + '/accounts', body).pipe(
      map((response: any) => {
        const result = new Array<Account>()

        const size = response.size

        for (let _i = 0; _i < size; _i++) {
          const jsonObj = response.listAccount[_i]

          //let accountBalance = new Account( jsonObj.accountPk, jsonObj.numberAccount, jsonObj.availableBalance, jsonObj.unclearedBalance, jsonObj.currency );
          result.push(jsonObj as Account)
        }
        return result
      }),
    )
  }

  public getAccount(account: number): Observable<Account> {
    const data = null

    return this.http.post(this.servicesUrl + '/accounts/' + account, data).pipe(
      map((response: any) => {
        const output = response
        const jsonObj = output['account']

        return jsonObj as Account
      }),
    )
  }

  public getStatements(
    page: number,
    rows: number,
    account: Account,
    dateFrom,
    dateTo,
    amountTo,
    amountFrom,
    show,
    filterBy,
    order,
    orderType,
  ): Observable<PagedData<ModelStatement>> {
    if (account === undefined) {
      this.router.navigateByUrl('/accounts/currentAccounts')
    } else {
      const data = {
        accountNumber: account.fullAccountNumber,
        amountFrom,
        amountTo,
        billType: null,
        dateFrom: this.dateFormatPipe.transform(dateFrom, this.dateFormat),
        dateTo: this.dateFormatPipe.transform(dateTo, this.dateFormat),
        filterBy: filterBy ? filterBy : '000',
        govPay: null,
        govPayType: null,
        page,
        rows,
        statementsOrder: 0,
        typeTransaction: show,
      }

      return this.http
        .post(this.servicesUrl + '/accountsStatements/search', data)
        .pipe(
          map((response: any) => {
            const output = response
            const pagedData = new PagedData<ModelStatement>()
            const pageObject = new Page()

            pageObject.pageNumber = page
            pageObject.pageSize = rows
            pageObject.size = output.accstmtDTO.size
            pageObject.totalElements = output.accstmtDTO.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            pagedData.page = pageObject
            //let size = output.size;
            const size = output.accstmtDTO.items.length
            for (let _i = 0; _i < size; _i++) {
              const jsonObj = output.accstmtDTO.items[_i]
              const dataStatment = new Date(jsonObj.date)
              const dateGroup =
                dataStatment.getFullYear() +
                '' +
                this.pad(dataStatment.getMonth(), 2) +
                '' +
                this.pad(dataStatment.getDate(), 2)
              const accountBalance = new ModelStatement(
                jsonObj.amount,
                jsonObj.balance,
                jsonObj.channelType,
                jsonObj.date,
                jsonObj.description,
                jsonObj.hijraDate,
                jsonObj.hijraDayText,
                jsonObj.hijraMonthText,
                jsonObj.occDayText,
                jsonObj.occMonthText,
                jsonObj.remarks,
                jsonObj.time,
                dateGroup,
                jsonObj.txCode,
                jsonObj.txId,
                jsonObj.weekDay,
              )
              //let accountBalance = new Account( jsonObj.accountPk, jsonObj.numberAccount, jsonObj.availableBalance, jsonObj.unclearedBalance, jsonObj.currency );
              pagedData.data.push(accountBalance)
            }
            //console.log("pagedData.data", pagedData.data);
            return pagedData
          }),
        )
    }
  }

  public getDetailStatements(detail, account): Observable<any> {
    const data = {
      accountNumber: account.fullAccountNumber,
      statment: detail,
    }
    return this.http
      .post(this.servicesUrl + '/accountsStatements/detail', data)
      .pipe(
        map((response: any) => {
          const output = response
          return output
        }),
      )
  }

  pad(num, size) {
    let s = num + ''
    while (s.length < size) {
      s = '0' + s
    }
    return s
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

  public getPdf(
    page: number,
    rows: number,
    account: Account,
    dateFrom,
    dateTo,
    amountTo,
    amountFrom,
    show,
    filterBy,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      accountNumber: account.fullAccountNumber,
      amountFrom,
      amountTo,
      billType: null,
      dateFrom: this.dateFormatPipe.transform(dateFrom, this.dateFormat),
      dateTo: this.dateFormatPipe.transform(dateTo, this.dateFormat),
      filterBy: filterBy ? filterBy : '000',
      govPay: null,
      govPayType: null,
      page: 1,
      rows,
      statementsOrder: 0,
      typeTransaction: show,
    }
    let headers = new HttpHeaders()
    headers = headers.set('Accept', 'application/pdf')

    return this.http.post(this.servicesUrl + '/accountsStatements/pdf', data, {
      responseType: 'blob',
    })
  }

  public getDetailPdf(row, account): Observable<any> {
    const data = {
      accountNumber: account.fullAccountNumber,
      accountStmt: row,
    }
    let headers = new HttpHeaders()
    headers = headers.set('Accept', 'application/pdf')

    return this.http.post(
      this.servicesUrl + '/accountsStatements/pdfDetail',
      data,
      { responseType: 'blob' },
    )
  }

  getXlsx(
    page: number,
    rows: number,
    account: Account,
    dateFrom,
    dateTo,
    amountTo,
    amountFrom,
    show,
    filterBy,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      accountNumber: account.fullAccountNumber,
      amountFrom,
      amountTo,
      billType: null,
      dateFrom: this.dateFormatPipe.transform(dateFrom, this.dateFormat),
      dateTo: this.dateFormatPipe.transform(dateTo, this.dateFormat),
      filterBy: filterBy ? filterBy : '000',
      govPay: null,
      govPayType: null,
      page: 1,
      rows,
      statementsOrder: 0,
      typeTransaction: show,
    }
    let headers = new HttpHeaders()
    headers = headers.set('Accept', 'application/pdf')

    return this.http.post(
      this.servicesUrl + '/accountsStatements/excel',
      data,
      { responseType: 'blob' },
    )
  }

  public sendEmail(
    page: number,
    rows: number,
    account: Account,
    dateFrom,
    dateTo,
    amountTo,
    amountFrom,
    show,
    filterBy,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      accountNumber: account.fullAccountNumber,
      amountFrom,
      amountTo,
      billType: null,
      dateFrom: this.dateFormatPipe.transform(dateFrom, this.dateFormat),
      dateTo: this.dateFormatPipe.transform(dateTo, this.dateFormat),
      filterBy: filterBy ? filterBy : '000',
      govPay: null,
      govPayType: null,
      page: 1,
      rows,
      statementsOrder: 0,
      typeTransaction: show,
    }

    return this.http.post(
      this.servicesUrl + '/accountsStatements/sendMail',
      data,
    )
  }

  public sendDetailEmail(row, account): Observable<any> {
    const data = {
      accountNumber: account.fullAccountNumber,
      accountStmt: row,
    }

    return this.http.post(
      this.servicesUrl + '/accountsStatements/sendDetailMail',
      data,
    )
  }

  public sendNicknameUpdate(modifiedAccounts: Account[]): Observable<any> {
    const listAccount = {
      listAccount: modifiedAccounts,
    }
    const data = JSON.stringify(listAccount)
    return this.http.post(
      this.servicesUrl + '/accounts/nicknameUpdate',
      listAccount,
    )
  }

  transformComboValue(comboName, key): string {
    let value = ''
    if (this.requestedCombos === undefined) {
      return value
    }
    const combo = this.requestedCombos.find((rqCb) => {
      return rqCb['name'] === comboName
    })
    if (combo === undefined || combo === null) {
      return value
    }
    value = combo.comboValues.find((item) => {
      return item.key === key
    })
    return value['value'] === undefined ? '' : value['value']
  }
}
