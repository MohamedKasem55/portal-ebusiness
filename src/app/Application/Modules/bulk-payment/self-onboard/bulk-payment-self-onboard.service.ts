import { Injectable } from '@angular/core';
import {AbstractService} from "../../Common/Services/Abstract/abstract.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../core/config/config.resource.local";
import {FormBuilder, Validators} from "@angular/forms";
import {CommonValidators} from "../../Common/constants/common-validators.service";
import {SimpleMQ} from "ng2-simple-mq";
import {Observable} from "rxjs";
import {confirmNewRegistrationReq, validateNewRegistrationReq} from "../models/self-onbaord.models";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class BulkPaymentSelfOnboardService extends AbstractService{

  constructor(
      protected http: HttpClient,
      public config: ConfigResourceService,
      protected fb: FormBuilder,
      public commonValidators: CommonValidators
  ) {
    super(http, config)
  }

  getForm(){
    return this.fb.group({
      ibanNumber: ['', Validators.required],
      monthlyFees: [{value: '', disabled: true}],
      transferFess: [{value: '', disabled: true}],
    })
  }

  getSARAccounts(): Observable<any> {
    return this.http.get(this.servicesUrl + '/userProfile/getSARAccounts').pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  initiateRequest(): Observable<any>{
      return this.http.get(this.servicesUrl + '/agreement/bulkPayment/initiate')
  }

  validateNewRegistration(request: validateNewRegistrationReq): Observable<any> {
    return this.http.post(this.servicesUrl + '/agreement/bulkPayment/validate', request)
  }

  confirmNewRegistration(request: confirmNewRegistrationReq): Observable<any> {
    return this.http.post(this.servicesUrl + '/agreement/bulkPayment/confirm', request)
  }

  get tcLink(): string {
    return `${this.config.getDocumentUrl()}/.pdf`
  }
}
