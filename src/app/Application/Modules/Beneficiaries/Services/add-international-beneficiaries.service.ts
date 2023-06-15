import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'
@Injectable()
export class AddInternationalBeneficiaryService {
  servicesUrl: string

  public cacheCombos: Map<String, any> = new Map<String, any>()

  public allComboData: any = []

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  // Service management error
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

  public getCountryNames(productCode: string): Observable<any> {
    return this.http
      .get(
        this.servicesUrl +
          '/beneficiaries/international/countries/' +
          productCode,
      )
      .pipe(catchError(this.handleError))
  }

  public getBanks(
    productCode: string,
    countryCode: String,
    countryISO: String,
  ): Observable<any> {
    return this.http
      .get(
        this.servicesUrl +
          '/beneficiaries/internationalTransferBanks/' +
          productCode +
          '/' +
          countryCode +
          '/' +
          countryISO,
      )
      .pipe(catchError(this.handleError))
  }
  public getBranches(bank: any, countryCode: string): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/beneficiaries/international/bankBranches', {
        beneficiaryBankCode: bank.bankCode,
        beneficiaryCountry: countryCode,
        productCode: 'PAY',
        routingCode: bank.swiftCode,
        routingIndex: bank.routingIndex,
      })
      .pipe(catchError(this.handleError))
  }

  public getInternationalCurrencies(
    productCode: string,
    countryCode: String,
    bankCode: String,
  ): Observable<any> {
    return this.http
      .get(
        this.servicesUrl +
          '/beneficiaries/international/currencies/' +
          productCode +
          '/' +
          countryCode +
          '/' +
          bankCode,
      )
      .pipe(catchError(this.handleError))
  }
  public getTransferTypes(
    countryCode: string,
    bankCode: String,
    productCode: String,
    currencyCode: String,
  ): Observable<any> {
    return this.http
      .get(
        this.servicesUrl +
          '/beneficiaries/international/transferTypes/' +
          countryCode +
          '/' +
          bankCode +
          '/' +
          currencyCode +
          '/' +
          productCode +
          '/' +
          'B',
      )
      .pipe(catchError(this.handleError))
  }
  public getBankConfigurations(
    bank: any,
    country: any,
    currency: any,
    juridicalStatus: String,
    serviceType: any,
  ): Observable<any> {
    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/international/bankConfiguration',
        {
          bankCode: bank.bankCode,
          country: country.key,
          currency: currency.currencyCode,
          juridicalStatus: juridicalStatus,
          productType: 'PAY',
          serviceType: serviceType,
          bankSwiftCode: bank.swiftCode,
        },
      )
      .pipe(catchError(this.handleError))
  }
  public getBankDetails(swiftCode: string): Observable<any> {
    return this.http
      .get(
        this.servicesUrl +
          '/beneficiaries/international/bankBranchDetails' +
          '/' +
          'PAY' +
          '/' +
          swiftCode,
      )
      .pipe(catchError(this.handleError))
  }
}
