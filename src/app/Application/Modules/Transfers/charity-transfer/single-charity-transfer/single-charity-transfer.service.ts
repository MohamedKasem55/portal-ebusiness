import { Injectable } from '@angular/core';
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ModelService} from "../../../../Components/common/model.service";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {catchError} from "rxjs/internal/operators/catchError";
import {map} from "rxjs/internal/operators/map";

@Injectable({
  providedIn: 'root'
})
export class SingleCharityTransferService extends AbstractService{

  // servicesUrl:string;

  constructor(
      public http: HttpClient,
      public config: ConfigResourceService,
      public fb: FormBuilder,
      public translate: TranslateService
  ) {
    super(http, config);
    // this.servicesUrl = this.config.getServicesUrl();
  }

  getFormModel(): FormGroup {
    return this.fb.group({
      accountNumberFrom: [null, Validators.required],
      accountNumberTo: [null, Validators.required],
      transferAmount: [null, Validators.required],
      remarks: [null],
    })
  }

  validateSingleCharityTransfer(): Observable<any>{
    return this.http.post(this.servicesUrl+'/transfers/singleCharity/validate',{}).pipe(catchError(this.handleError));
  }

  confirmSingleCharityTransfer(data): Observable<any>{
    return this.http.post(this.servicesUrl+'/transfers/singleCharity/confirm',data).pipe(catchError(this.handleError));
  }

  getSARAccounts(): Observable<any> {
    return this.http.get(this.servicesUrl + '/userProfile/getSARAccounts').pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }
}
