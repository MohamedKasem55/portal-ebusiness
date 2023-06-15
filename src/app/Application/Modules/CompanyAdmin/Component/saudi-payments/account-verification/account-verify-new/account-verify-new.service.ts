import { Injectable } from '@angular/core';
import {AbstractService} from "../../../../../Common/Services/Abstract/abstract.service";
import {HttpClient} from "@angular/common/http";
import {ConfigResourceService} from "../../../../../../../core/config/config.resource.local";
import {FormBuilder, Validators} from "@angular/forms";
import {CommonValidators} from "../../../../../Common/constants/common-validators.service";
import {AccountVerifyConfirmReq, AccountVerifyValidateReq} from "../../models/account-verify";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AccountVerifyNewService extends AbstractService{

  constructor(
      public http: HttpClient,
      public config: ConfigResourceService,
      public fb: FormBuilder,
      public commonValidators: CommonValidators,
  ) {
    super(http, config)
  }

  accountVerifyValidate(request: AccountVerifyValidateReq): Observable<any>{
    return this.http.post(this.servicesUrl + '/accountVerify/new/validate', request)
  }

  accountVerifyConfirm(request: AccountVerifyConfirmReq): Observable<any>{
    return this.http.post(this.servicesUrl + '/accountVerify/new/confirm', request)
  }

  get formModel(){
    return this.fb.group({
      beneficiaryIban: [null,
        [Validators.required,
        Validators.pattern(this.commonValidators.saudiIbanWithOrWithoutLetters),
        Validators.maxLength(24),
        Validators.minLength(22),]
      ],
      beneficiaryId: [null, Validators.required],
      proxyType: null,
      remitterIban: [null, Validators.required],
      bankName:null
    })
  }
}
