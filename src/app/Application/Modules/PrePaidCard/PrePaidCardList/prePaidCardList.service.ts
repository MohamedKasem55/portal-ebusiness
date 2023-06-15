import { Injectable } from '@angular/core'
import {
  PrepaidCardListResponse,
  PrepaidCardItem,
} from './prePaidCardListModel'
import { Observable } from 'rxjs'
import { Exception } from 'app/Application/Model/exception'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { map, catchError } from 'rxjs/operators'
import { throwError as observableThrowError } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PrePaidCardListService {
  public static BIN = '484166'
  constructor(private http: HttpClient, public config: ConfigResourceService) {}

  // PREPAID CARD LIST (POST)
  public getPrepaidCardList(request): Observable<PrepaidCardListResponse> {
    const url = this.config.getServicesUrl() + '/prepaidCards/list'
    return this.http.get(url).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode != 0) {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return errorService
        } else {
          return body
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
      errMsg = `${error.status} - ${error.statusText || ''}${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }

    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }
  cardFilterByBin(prepaidCardList: PrepaidCardItem[]): PrepaidCardItem[] {
    return prepaidCardList
        ? prepaidCardList.filter((card) =>
            card.cardNumber.startsWith(PrePaidCardListService.BIN),
        )
        : []
  }
  groupPrepaidCardListInSlides(
      prepaidCardList: PrepaidCardItem[],
      chunkSize: number,
  ): PrepaidCardItem[][] {
    const slides: PrepaidCardItem[][] = []
    for (let i = 0; i < prepaidCardList.length; i += chunkSize) {
      let list: PrepaidCardItem[] = []
      list = prepaidCardList.slice(i, i + chunkSize)
      slides.push(list)
    }

    return prepaidCardList ? slides : []
  }
}
