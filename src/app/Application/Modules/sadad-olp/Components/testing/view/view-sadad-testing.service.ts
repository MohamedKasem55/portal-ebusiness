import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AbstractService } from '../../../../Common/Services/Abstract/abstract.service'

@Injectable()
export class ViewSadadTestingService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public startViewTesting(values: any): Observable<any> {
    const params = {
      testRqId: values.testRqId,
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/testing/view/start',
      params,
    )
  }
}
