import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { AbstractService } from '../../../../Common/Services/Abstract/abstract.service'

@Injectable()
export class InitiateSadadTestingService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  public startInitiateTesting(values: any): Observable<any> {
    const params = {
      version: values[0].version,
    }

    return this.http.post(
      this.servicesUrl + '/sadadolp/testing/initiate/start',
      params,
    )
  }
}
