import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import {
  RequestAccountsList,
  RequestSearchStatement,
  RequestStaticList,
  ResponseComboAccounts,
  StaticsModelDTO,
} from './request-statement-models'

@Injectable({
  providedIn: 'root',
})
export class RequestStatementService {
  servicesUrl: string
  check
  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getAccountCombo(
    body: RequestAccountsList,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<ResponseComboAccounts>
  public getAccountCombo(
    body: RequestAccountsList,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<ResponseComboAccounts>>
  public getAccountCombo(
    body: RequestAccountsList,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<ResponseComboAccounts>>
  public getAccountCombo(
    body: RequestAccountsList,
    observe: any = 'body',
    reportProgress?: boolean,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling getAccountCombo.',
      )
    }
    return this.http.post(this.servicesUrl + '/accounts/', body, {
      reportProgress,
      responseType: 'json',
    })
  }

  public getFilterByCombo(
    body: RequestStaticList,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<StaticsModelDTO>
  public getFilterByCombo(
    body: RequestStaticList,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<StaticsModelDTO>>
  public getFilterByCombo(
    body: RequestStaticList,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<StaticsModelDTO>>
  public getFilterByCombo(
    body: RequestStaticList,
    observe: any = 'body',
    reportProgress?: boolean,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling getFilterByCombo.',
      )
    }
    return this.http.post(this.servicesUrl + '/statics/list', body, {
      reportProgress,
      responseType: 'json',
    })
  }

  public generateExcel(
    body: RequestSearchStatement,
    responseType?: 'json' | 'text' | 'blob',
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<any>
  public generateExcel(
    body: RequestSearchStatement,
    responseType?: 'json' | 'text' | 'blob',
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<any>>
  public generateExcel(
    body: RequestSearchStatement,
    responseType?: 'json' | 'text' | 'blob',
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<any>>
  public generateExcel(
    body: RequestSearchStatement,
    responseType?: 'json' | 'text' | 'blob',
    observe: any = 'body',
    reportProgress?: boolean,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling generateExcel.',
      )
    }
    return this.http.post(
      this.servicesUrl + '/accountsStatements/excel',
      body,
      { reportProgress, responseType: 'blob' },
    )
  }

  public generatePdf(
    body: RequestSearchStatement,
    responseType?: 'json' | 'text' | 'blob',
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<any>
  public generatePdf(
    body: RequestSearchStatement,
    responseType?: 'json' | 'text' | 'blob',
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<any>>
  public generatePdf(
    body: RequestSearchStatement,
    responseType?: 'json' | 'text' | 'blob',
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<any>>
  public generatePdf(
    body: RequestSearchStatement,
    responseType?: 'json' | 'text' | 'blob',
    observe: any = 'body',
    reportProgress?: boolean,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling generatePdf.',
      )
    }
    return this.http.post(this.servicesUrl + '/accountsStatements/pdf', body, {
      reportProgress,
      responseType: 'blob',
    })
  }
  amountValidCheck(fromValue, toValue): boolean {
    if (!fromValue || !toValue) {
      return true
    }
    this.check = fromValue * 1 <= toValue * 1
    //console.log(fromValue * 1 < toValue * 1);
    return fromValue * 1 <= toValue * 1
  }
  getAmountCheck() {
    return this.check
  }
}
