import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AppService } from '../../../../core/service/app.service'

@Injectable()
export class MonthlyStatementsService extends AppService {
  private servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    super()
    this.servicesUrl = config.getServicesUrl()
  }

  public getAccounts(): Observable<any> {
    const data = {
      order: '',
      orderType: '',
      page: 1,
      rows: 100,
      txType: 'ECIA',
    }
    const body = JSON.stringify(data)

    return this.http.post(this.servicesUrl + '/accounts/combo', body).pipe(
      map((response: any) => {
        const result = new Array()
        const output = response

        for (let i = 0; i < output.accountComboList.length; i++) {
          result.push(output.accountComboList[i]['value'])
        }

        return result
      }),
    )
  }

  getStatementList(account: string) {
    const data = {
      parameter: account,
    }
    return this.http
      .post<any>(this.servicesUrl + '/accountsStatements/monthly', data)
      .pipe(catchError(this.handleError))
  }

  getPdf(file): Observable<any> {
    const data = {
      parameter: file,
    }

    let headers = new HttpHeaders()
    headers = headers.set('Accept', 'application/pdf')

    return this.http
      .post(this.servicesUrl + '/accountsStatements/monthly/download', data, {
        responseType: 'blob',
      })
      .pipe(map((response: any) => response))
  }
}
