import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'
import { ValidateAccount } from '../../Beneficiaries/Services/beneficiaries-validate-account.service'
import { AliasManagement } from '../Model/alais-management'

@Injectable()
export class AliasManagementService {
  servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
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

  public getIPSList(iban: string): Observable<any> {
    return this.http
      .get(this.servicesUrl + '/ips/proxy/list?iban=' + iban)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public validate(aliasManagement: AliasManagement): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/ips/proxy/manage/validate', aliasManagement)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public confirm(aliasManagement: AliasManagement): Observable<any> {
    return this.http
      .post(this.servicesUrl + '/ips/proxy/manage/confirm', aliasManagement)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }

  public updateIPSTCStatus(ipstcstatus): Observable<any> {
    return this.http
      .put(this.servicesUrl + '/postLogin/updateIPSTCStatus', ipstcstatus)
      .pipe(
        map((response: any) => response),
        catchError(this.handleError),
      )
  }
}
