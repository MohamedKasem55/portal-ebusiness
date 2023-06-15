import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractService } from '../../../Common/Services/Abstract/abstract.service'

@Injectable()
export class RefundSadadOLPService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public validateRefund(values: any, action: any): Observable<any> {
    const refunds = []

    for (let i = 0; i < values.refunds.length; i++) {
      const refundObj = values.refunds[i].refund
      refundObj['refundRejectionReason'] = values['genericRefundRejectReason']
      const data = {
        amount: values.refunds[i].approvedAmount,
        reason: values.refunds[i].reason,
        refund: { refundObj },
        rejection: values['genericRefundRejectReason'],
        remark: values.refunds[i].resolutionRemarks,
      }
      refunds.push(data)
    }

    const data = {
      operation: action,
      sadadRefundsValidateList: refunds,
    }

    const params = JSON.stringify(data)

    return this.http.post(
      this.servicesUrl + '/sadadolp/refunds/validate',
      params,
    )
  }

  public confirmRefund(batchList: any): Observable<any> {
    return this.http.post(this.servicesUrl + '/sadadolp/refunds/confirm', {
      batchList,
    })
  }
}
