import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, of, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from 'app/Application/Model/exception'

@Injectable()
export class AccountFormData {
  servicesUrl: string
  comboRequest: string[]
  serviceResponse: Object

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

  setData(JSON_response: any): any {
    this.serviceResponse = JSON_response || {}

    for (let i = 0; i < this.comboRequest.length; i++) {
      const data = this.serviceResponse[i]['props']

      this.allComboData.push({
        comboName: this.comboRequest[i],
        values: this.serviceResponse[i]['props'],
      })
    }

    return this.allComboData
  }

  getAllCombos(combos: string[]): Observable<any> {
    if (this.allComboData.length == 0) {
      // Almaceno los combos que se van a consultar para no solicitarlos de nuevo
      this.comboRequest = combos

      // Se contrullen los parametros de entrada
      let entryParam = '{"names": ['

      // Por cada elemento del array vamos formando el JSON de entrada
      for (let i = 0; i < combos.length; i++) {
        entryParam += '"' + combos[i] + '"'
        if (i < combos.length - 1) {
          entryParam += ','
        }
      }
      entryParam += ']}'

      // Sevice call
      return this.http
        .post(this.servicesUrl + '/statics/list', entryParam)
        .pipe(
          map((response: any) => {
            const body = response
            return this.setData(body)
            //return body || {};
          }),
          catchError(this.handleError),
        )
    } else {
      return of(this.allComboData)
    }
  }
}
