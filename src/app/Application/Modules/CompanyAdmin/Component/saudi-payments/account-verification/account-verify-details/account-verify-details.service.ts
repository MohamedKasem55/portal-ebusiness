import { Injectable } from '@angular/core';
import {AbstractService} from "../../../../../Common/Services/Abstract/abstract.service";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../../../core/config/config.resource.local";

@Injectable({
  providedIn: 'root'
})
export class AccountVerifyDetailsService extends AbstractService{

  constructor(
      public http: HttpClient,
      public config: ConfigResourceService
  ) {
    super(http, config)
  }


  getVerifyAccountReqDetails(params): Observable<any>{
    return this.http.get(this.servicesUrl + '/accountVerify/details', {params: params})
  }
}
