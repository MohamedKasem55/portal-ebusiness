import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { throwError as observableThrowError } from 'rxjs'
import { catchError, filter, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class AddBeneficiaryService {
  servicesUrl: string
  previousUrl: string

  constructor(
    private http: HttpClient,
    private config: ConfigResourceService,
    private datePipe: DatePipe,
    private router: Router,
  ) {
    this.servicesUrl = config.getServicesUrl()
    this.routing()
  }

  public routing() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        const url = e.url.split('/')
        if (url[2] === 'beneficiaries') {
          this.previousUrl = url[2]
        } else if (url[1] === 'aramcoPayments' && !url[2]) {
          this.previousUrl = url[1]
        }
      })
  }

  public validatePassNumber(passNumber: any) {
    return this.http
      .get(`${this.servicesUrl}/aramcoBeneficiaries/getCustomer/${passNumber}`)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            //return observableThrowError( exception );
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  public saveNewBeneficiary(beneficiary: any) {
    const data: any = {
      aramcoCustomer: beneficiary,
    }

    return this.http
      .post(this.servicesUrl + '/aramcoBeneficiaries/save', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
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

  public getPreviousUrl() {
    return this.previousUrl
  }
}
