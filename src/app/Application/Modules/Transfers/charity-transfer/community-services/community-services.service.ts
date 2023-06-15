import { Injectable } from '@angular/core';
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {catchError} from "rxjs/internal/operators/catchError";

@Injectable({
  providedIn: 'root'
})
export class CommunityServicesService extends AbstractService{

  constructor(
      public http: HttpClient,
      public config: ConfigResourceService,
      public fb: FormBuilder,
      public translate: TranslateService
  ) {
    super(http, config);
  }

  getFormModel(): FormGroup {
    return this.fb.group({
      charityCategoryPk: null,
      charityGroupId: null
    })
  }

  getSingleCharityList(request): Observable<any>{
    return this.http.get(this.servicesUrl+'/transfers/singleCharity/list',{params: request}).pipe(catchError(this.handleError));
  }

}
