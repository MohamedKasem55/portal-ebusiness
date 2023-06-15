import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

export interface ErrorResponse {
  arabicMessage: string
  code: string
  description: string
  englishMessage: string
}

export interface FileList {
  accountFrom: string
  approvedBy: string
  approvedDate: string
  batchName: string
  customerReference: string
  dataReceived: string
  dirUploadArchive: boolean
  fileName: string
  fileSize: number
  fileType: string
  initiatedBy: string
  initiationDate: string
  localRecordAmount: number
  localRecordCount: number
  paymentDate: string
  rajhiRecordAmount: number
  rajhiRecordCount: number
  totalAmount: number
  userFileName: string
}

export interface ResponseGetDashboardDirectDebits {
  errorCode: string
  errorDescription: string
  errorResponse: ErrorResponse
  fileList: FileList[]
  months: string[]
}

export interface RequestGetDashboardDirectDebits {
  paymentDateFrom: string
  paymentDateTo: string
  search: boolean
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  servicesUrl: string

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public getDashboard(
    body: RequestGetDashboardDirectDebits,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<ResponseGetDashboardDirectDebits>
  public getDashboard(
    body: RequestGetDashboardDirectDebits,
    observe?: 'response',
    reportProgress?: boolean,
  ): Observable<HttpResponse<ResponseGetDashboardDirectDebits>>
  public getDashboard(
    body: RequestGetDashboardDirectDebits,
    observe?: 'events',
    reportProgress?: boolean,
  ): Observable<HttpEvent<ResponseGetDashboardDirectDebits>>
  public getDashboard(
    body: RequestGetDashboardDirectDebits,
    observe: any = 'body',
    reportProgress?: boolean,
  ): Observable<any> {
    if (body === null || body === undefined) {
      throw new Error(
        'Required parameter body was null or undefined when calling postAmbitByDocumentId.',
      )
    }
    return this.http.post(this.servicesUrl + '/directDebits/dashboard', body, {
      reportProgress,
      responseType: 'json',
    })
  }
}
