/**
 * Service to obtain the balance certificate
 */
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'
@Injectable()
export class GetHostStaticData {
  public token: string
  public servicesUrl: string
  public currentUser

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

  // GET ALL COUNTRIES
  /*
    public getCountries(): Observable<string> {
        return this.http.get( this.servicesUrl + "/beneficiaries/within/add" )
            .pipe(map(( response: any ) => {
                let body = response;
                return body || {};
            } ),catchError( this.handleError ));
    }
    */

  // GET ALL BANK NAME FILTER BY COUNTRY
  public getBankNames(idCountry: string): Observable<any> {
    //console.log("Ruta servicio: ", this.servicesUrl + "/beneficiaries/international/search/bankNameList/" + idCountry);
    return this.http
      .get(
        this.servicesUrl +
          '/beneficiaries/international/search/bankNameList/' +
          idCountry,
      )
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  // GET ALL BRANCH FILTER BY BANK NAME
  public getBranchNames(bankName: string, idBank: string): Observable<string> {
    const data = {
      bankName,
      countryCode: idBank,
    }
    //let body = JSON.stringify(data);
    //console.log("branch");
    //
    return this.http
      .post(
        this.servicesUrl + '/beneficiaries/international/search/branchNameList',
        data,
      )
      .pipe(
        map((response: any) => {
          //console.log("Respuesta servicio", response);
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }
}
