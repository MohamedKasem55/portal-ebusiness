import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class LiquidityManagementService {
  servicesUrl: string

  constructor(
    public http: HttpClient,
    public config: ConfigResourceService,
    public authenticationService: AuthenticationService,
  ) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getResults(): Observable<any> {
    const data: any = {}

    // const body = JSON.stringify(data);

    //

    return this.http.get(this.servicesUrl + '/liquidityManagement/accountsList')
  }
  /*
  public handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server error datachart');
  }
*/
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

  /**
   * A method that mocks a paged server response
   * @param page The selected page
   * @returns {any} An observable containing the employee data
   */
  /*
  public postResults(params: any): any {
    // Input params
    let data = params;
    data.companyLiquidityAccountsDSO.externalAccounts[0].selected = 'N';
    //

    return this.http.post(
      this.servicesUrl + '/liquidityManagement/saveAccounts',
      data
    );
  }
*/
  saveData(rows): Observable<any> {
    let data: any = {}
    data = rows
    // data.companyLiquidityAccountsDSO.externalAccounts[0].selected = 'Y';
    // data.companyLiquidityAccountsDSO.externalAccounts[2].selected = 'Y';

    // const body = JSON.stringify(data);
    return this.http
      .post(this.servicesUrl + '/liquidityManagement/saveAccounts', data)
      .pipe(
        map((response: any, index: number) => {
          let result: any = {}
          const output = response

          if (output.errorCode !== '0') {
            result.error = true
            result.errorCode = output.errorCode
            result.errorDescription = output.errorDescription
          } else {
            result = output
            result.error = false
          }
          return result
        }),
      )
  }
}
