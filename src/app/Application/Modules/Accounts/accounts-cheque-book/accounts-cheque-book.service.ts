import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { Router } from '@angular/router'

@Injectable()
export class AccountsChequeBookService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    private router: Router,
  ) {
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
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  // ADD INTERNATIONAL BENEFICIARY
  public getAccountsCombo(): Observable<any> {
    return this.http.get(this.servicesUrl + '/userProfile/getSARAccounts').pipe(
      map((response: any) => response),
      catchError(this.handleError),
    )
  }

  public chequebookValidate(chequeType, account): Observable<any> {
    const data = {
      accountNumber: account,
      chequeType,
    }

    return this.http
      .post(this.servicesUrl + '/chequeBook/create/validate', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            this.router.navigate(['/accounts/chequeBookStep2'])
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
