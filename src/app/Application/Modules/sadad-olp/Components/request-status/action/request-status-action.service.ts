import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AbstractService } from '../../../../Common/Services/Abstract/abstract.service'

@Injectable()
export class RequestStatusActionService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public reInitiateRefunds(batchList: any, values: any): Observable<any> {
    for (let i = 0; i < values.refunds.length; i++) {
      batchList[i].approvedAmount = values.refunds[i].approvedAmount
      batchList[i].refundDetails = values.refunds[i].resolutionRemarks
      batchList[i].rejectedReason = values.refunds[i].refundRejectionReason
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/requestStatus/refunds/reInitiate',
      { batchList },
    )
  }

  public saveReInitiateRefunds(batchList: any): Observable<any> {
    return this.http.post(
      this.servicesUrl + '/sadadolp/requestStatus/refunds/saveReInitiate',
      { batchList },
    )
  }

  public deleteRefunds(batchList: any): Observable<any> {
    const data = {
      batchList: batchList,
    }
    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http.delete(
      this.servicesUrl + '/sadadolp/requestStatus/refunds/delete',
      { params: _param },
    )
  }

  public reInitiateDisputes(batchList: any, values: any): Observable<any> {
    for (let i = 0; i < values.disputes.length; i++) {
      batchList[i].amount = values.disputes[i].amount
      batchList[i].details = values.disputes[i].details
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/requestStatus/disputes/reInitiate',
      { batchList },
    )
  }

  public saveReInitiateDisputes(batchList: any): Observable<any> {
    return this.http.post(
      this.servicesUrl + '/sadadolp/requestStatus/disputes/saveReInitiate',
      { batchList },
    )
  }

  public deleteDisputes(batchList: any): Observable<any> {
    const data = {
      batchList: batchList,
    }
    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http.delete(
      this.servicesUrl + '/sadadolp/requestStatus/disputes/delete',
      { params: _param },
    )
  }
}
