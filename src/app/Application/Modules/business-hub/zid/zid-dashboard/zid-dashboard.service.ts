import { Injectable } from '@angular/core';
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";

@Injectable({
  providedIn: 'root'
})
export class ZidDashboardService extends AbstractService{

  public SYS_ID = "ZID"
  servicesUrl: string

  constructor(
      public config: ConfigResourceService,
      protected http: HttpClient
  ) {
    super(http, config)
    this.servicesUrl = config.businessHubServicesUrl
  }

  loadAccounts(){

  }

  hasAccess(): Observable<any>{
    return this.http.get(this.servicesUrl + `/eBusinessHubStores/hasAccess/${this.SYS_ID}`).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  login(data: any): Observable<any>{
    return this.http.post(this.servicesUrl + `/eBusinessHubStores/login`, data).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }

  renewZidSubscription(data: any): Observable<any>{
    return this.http.post(this.servicesUrl + `/eBusinessHubStores/zidRenewSubscription`, data).pipe(
        map((response: any) => response),
        catchError(this.handleError)
    )
  }
}
