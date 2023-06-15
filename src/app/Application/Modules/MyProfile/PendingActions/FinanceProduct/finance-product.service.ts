import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms'
import { AbstractService } from '../../../Common/Services/Abstract/abstract.service'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'

@Injectable()
export class FinanceProductService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected fb: FormBuilder,
  ) {
    super(http, config)
  }

  public createInformationForm(data): FormGroup {
    const form = this.fb.group({
      numberOfBusiness: [data.businessOutletsNum, []],
      typeOfBusiness: [data.businessOutletsType, [Validators.required]],
      patternDescription: [data.businessModelSalesDesc, [Validators.required]],
      c_fullYearAccount: [data.currentYearFullYearAcct, []],
      c_fromDate: [new Date(data.currentYearFromDate), []],
      c_toDate: [new Date(data.currentYearToDate), []],
      c_accountType: [data.currentYearAcctType, []],
      c_salesTurnover: [data.currentYearSalesTurnOver, []],
      c_grossProfit: [data.currentYearGrossProfit, []],
      c_netProfit: [data.currentYearNetProfit, []],
      l_fullYearAccount: [data.fullYearAcct, []],
      l_fromDate: [new Date(data.lastYearFromDate), []],
      l_toDate: [new Date(data.lastYearToDate), []],
      l_accountType: [data.lastYearAcctType, []],
      l_salesTurnover: [data.lastYearSalesTurnOver, []],
      l_grossProfit: [data.lastYearGrossProfit, []],
      l_netProfit: [data.lastYearNetProfit, []],
      p_fullYearAccount: [data.previouseYearAcctType, []],
      p_fromDate: [new Date(data.previouseYearFromDate), []],
      p_toDate: [new Date(data.previouseYearToDate), []],
      p_accountType: [data.previouseYearAcctType, []],
      p_salesTurnover: [data.previouseYearSalesTurnOver, []],
      p_grossProfit: [data.previouseYearGrossProfit, []],
      p_netProfit: [data.previouseYearNetProfit, []],
      firstRepaymentDate: [
        new Date(data.firstRePymtDate),
        [Validators.required],
      ],
      dossierId: [data.dossierId, []],
    })
    return form
  }

  public getList() {
    return this.http
      .post(this.servicesUrl + '/finance/pending/list', { pending: true })
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response.batchList.items
          }
        }),
      )
  }

  public validat(row) {
    return this.http
      .post(this.servicesUrl + '/finance/pending/validat', [row])
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public confirm(row, requestValidate) {
    const data = { batchList: [row], requestValidate }
    return this.http
      .post(this.servicesUrl + '/finance/pending/confirm', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public refuse(row) {
    const data = { batchList: [row] }
    return this.http
      .post(this.servicesUrl + '/finance/pending/refuse', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public getLOV(name) {
    return this.http.post(this.servicesUrl + '/statics/model/', { name }).pipe(
      map((response: any) => {
        if (!response.props) {
          return []
        } else {
          const items = response.props
          let result = []
          Object.keys(items).forEach(function (key) {
            result.push({ key, value: items[key] })
          })
          return result
        }
      }),
    )
  }
}
