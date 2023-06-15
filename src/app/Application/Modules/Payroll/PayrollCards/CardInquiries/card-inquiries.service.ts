import { DatePipe } from '@angular/common'
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Exception } from 'app/Application/Model/exception'
import { AppService } from 'app/core/service/app.service'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'

@Injectable()
export class CardInquiriesService extends AppService {
  servicesUrl: string

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public datePipe: DatePipe,
  ) {
    super()
    this.servicesUrl = config.getServicesUrl()
  }

  getCardInquiriesList(
    rows,
    page,
    cardNumber,
    departmentCodeSelected,
    nationalId,
    searchFlag,
    selectedIncentiveCards,
    status,
  ) {
    const data: any = {}
    data.page = page
    data.rows = rows

    if (cardNumber) data.cardNumber = cardNumber

    if (departmentCodeSelected)
      data.departmentCodeSelected = departmentCodeSelected

    if (nationalId) data.nationalId = nationalId

    if (searchFlag) data.searchFlag = searchFlag

    if (selectedIncentiveCards)
      data.selectedIncentiveCards = selectedIncentiveCards

    if (status) data.status = status

    return this.http
      .post(`${this.servicesUrl}/payrollCards/getCardInquiriesList`, data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') return new PagedData()

          const pageObject: Page = {
            pageNumber: page,
            size: response.size,
            totalElements: response.total,
            totalPages: response.total / response.size,
            pageSize: rows,
          }

          const pagedData: PagedData<any> = {
            data: response.cardIncentiveInstitutionsList,
            page: pageObject,
          }
          pagedData.data.forEach((ele) => (ele['statusIncentive'] = ele.status))

          return pagedData
        }),
      )
  }

  getCardTransaction(rows, page, cardNumber, instituteId, dateFrom, dateTo) {
    const data: any = {}
    data.page = page
    data.rows = rows

    if (cardNumber) data.cardNumber = cardNumber

    if (instituteId) data.institutionId = instituteId

    if (dateFrom)
      data.dateFrom = this.datePipe.transform(dateFrom, 'yyyy-MM-dd')

    if (dateTo) data.dateTo = this.datePipe.transform(dateTo, 'yyyy-MM-dd')

    return this.http
      .post(`${this.servicesUrl}/payrollCards/doPaginationCardsStatement`, data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') return new PagedData()

          const pageObject: Page = {
            pageNumber: page,
            size: response.incentiveStatementList.size,
            totalElements: response.incentiveStatementList.total,
            totalPages:
              response.incentiveStatementList.total /
              response.incentiveStatementList.size,
            pageSize: rows,
          }

          const pagedData: PagedData<any> = {
            data: response.incentiveStatementList.items,
            page: pageObject,
          }

          return pagedData
        }),
      )
  }

  getPDFCardStatement(cardSelected, instituteId, dateFrom, dateTo) {
    const data = {
      cardIncentiveInstitutionsSelected: cardSelected,
      dateFrom: dateFrom,
      dateTo: dateTo,
      incentiveCardStatement: {
        instituteId: instituteId
      }
    }
    return this.http
      .post(`${this.servicesUrl}/payrollCards/payrollCardsStatementPdf`, data, 
      {responseType: 'blob'}).pipe(
        map((response: any) => { return response
        }),catchError(this.handleError),
      )
  }

  getXLSCardStatement(cardSelected, instituteId, dateFrom, dateTo) {
    const data = {
      cardIncentiveInstitutionsSelected: cardSelected,
      dateFrom: dateFrom,
      dateTo: dateTo,
      incentiveCardStatement: {
        instituteId: instituteId
      }
    }
    return this.http
      .post(`${this.servicesUrl}/payrollCards/payrollCardsStatementExcel`, data, 
      {responseType: 'blob'}).pipe(
        map((response: any) => { return response
        }),catchError(this.handleError),
      )
  }

}
function observableThrowError(errorService: Exception) {
  throw new Error('Function not implemented.')
}

