import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class ReconciliationService {
  servicesUrl: string

  constructor(private http: HttpClient, private config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }
}
