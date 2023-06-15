import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { of, throwError as observableThrowError } from 'rxjs'
import { catchError, map, switchMap } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Exception } from '../../../../Model/exception'

@Injectable()
export class NationalAddressService {
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

  public getRegions() {
    return this.http.get(this.servicesUrl + '/nationalAddress/regions').pipe(
      switchMap((res: any) => {
        if (res.errorCode != 0) {
          const exception: Exception = new Exception(
            res.errorCode,
            res.errorDescription,
          )

          return observableThrowError(exception)
        } else {
          const regions = res['regionList']

          return of(regions)
        }
      }),
      catchError(this.handleError),
    )
  }

  public getCities(region) {
    return this.http
      .get(`${this.servicesUrl}/nationalAddress/cities/${region}`)
      .pipe(
        switchMap((res: any) => {
          if (res.errorCode != 0) {
            const exception: Exception = new Exception(
              res.errorCode,
              res.errorDescription,
            )

            return observableThrowError(exception)
          } else {
            const cities = res['cityList']

            return of(cities)
          }
        }),
        catchError(this.handleError),
      )
  }

  public register(nationalAddress) {
    return this.http
      .post(`${this.servicesUrl}/nationalAddress/register`, nationalAddress)
      .pipe(
        switchMap((res: any) => {
          const body = res
          if (res.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            return of(body)
          }
        }),
        catchError(this.handleError),
      )
  }
}
