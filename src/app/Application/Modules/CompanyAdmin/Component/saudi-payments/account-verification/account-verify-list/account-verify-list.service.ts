import { Injectable } from '@angular/core';
import {AbstractService} from "../../../../../Common/Services/Abstract/abstract.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../../../core/config/config.resource.local";
import {FormBuilder, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountVerifyListService extends AbstractService{

  constructor(
      public http: HttpClient,
      public config: ConfigResourceService,
      public fb: FormBuilder
  ) {
    super(http, config)
  }

  get formModel(){
    return this.fb.group({
      status: ['ACV_PENDING', Validators.required]
    })
  }

  listVerifiedAccounts(params): Observable<any>{
    return this.http.get(this.servicesUrl + '/accountVerify/list', {params: params})
  }
}
