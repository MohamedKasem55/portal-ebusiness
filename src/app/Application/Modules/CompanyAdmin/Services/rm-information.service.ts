import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { HttpClient } from '@angular/common/http'
import { AbstractService } from '../../Common/Services/Abstract/abstract.service'
import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'

@Injectable({
  providedIn: 'root'
})
export class RmInformationService extends AbstractService {
  servicesUrl: string

  constructor(public config: ConfigResourceService, public http: HttpClient, public storageService: StorageService,
    public translate: TranslateService) {
      super(http, config)
    this.servicesUrl = config.getServicesUrl()
  }


  public getRMInformation(): Observable<any> {
    return this.doGet(this.servicesUrl + '/relationshipManager/get')
  }
}
