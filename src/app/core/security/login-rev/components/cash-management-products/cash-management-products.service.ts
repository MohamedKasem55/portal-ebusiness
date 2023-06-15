import { Injectable } from '@angular/core';
import {OpenAdditionalAccountService} from "../../../../../Application/Modules/Accounts/Services/open-additional-account.service";
import {StaticService} from "../../../../../Application/Modules/Common/Services/static.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ConfigResourceService} from "../../../../config/config.resource.local";
import {StorageService} from "ngx-webstorage/lib/core/interfaces/storageService";
import {forkJoin, Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {AbstractService} from "../../../../../Application/Modules/Common/Services/Abstract/abstract.service";
import {RegisterProductInterest} from "../../models/http-requests.model";
import {CommonValidators} from "../../../../../Application/Modules/Common/constants/common-validators.service";

@Injectable({
  providedIn: 'root'
})
export class CashManagementProductsService extends AbstractService{

  constructor(
      public fb: FormBuilder,
      public router: Router,
      public translate: TranslateService,
      public config: ConfigResourceService,
      public http: HttpClient,
      public commonValidators: CommonValidators,
  ) {
    super(http, config)
  }

  public buildForm(product: string, currentUser?: any){
    return this.fb.group({
      product: [{ value: product, disabled: true }, [Validators.required]],
      orgName: [{value: currentUser?.company?.companyName ? currentUser?.company?.companyName :  '', disabled: !!currentUser?.company?.companyName} , [Validators.required]],
      orgId: [currentUser ? currentUser?.company?.profileNumber : '', [Validators.required, Validators.pattern('^\\s*-?[0-9]{10}\\s*$')]],
      region: ['', [Validators.required]],
      city: ['', [Validators.required]],
      yearlyIncome: ['', [Validators.required]],
      contactName: [{ value: currentUser?.user?.userName ? currentUser?.user?.userName : '', disabled: !!currentUser?.user?.userName}, [Validators.required]],
      contactMobile: [{ value: currentUser?.user?.mobile ? currentUser?.user?.mobile : '', disabled: !!currentUser?.user?.mobile}, [Validators.required, Validators.pattern('^(9665|05|\\+[1-9]{1,3})[0-9]{8,8}$')]],
      contactEmail: [{ value: currentUser?.user?.email ? currentUser?.user?.email : '', disabled: !!currentUser?.user?.email}, [Validators.required, Validators.pattern(this.commonValidators.EMAIL_VALIDATOR)]],
      bestTimeToCall: ['', [Validators.required]]
    })
  }

  submitProductInterest(data: RegisterProductInterest){
    return this.http.post(this.servicesUrl + '/ext/registerProductInterest', data).pipe(
        map((response: any) => {
          return response
        }),
        catchError(this.handleError),
    )
  }

  getStatics(names: string[]){
    const observables = []

    names.forEach(name => observables.push(this.getStatic(name)))

    return forkJoin(observables)
  }

  getStatic(name: string): Observable<any>{
    const data = {
      name: name
    }

    return this.http.post(this.servicesUrl + '/statics/externalModel', data).pipe(
        map((response: any) => {
          if (response.props) {
            const staticObj = {}
            const result = []
            for (const _prop in response.props) {
              if (_prop)
                result.push({ key: _prop, value: response.props[_prop] })
            }
            staticObj[name] = result
            return staticObj
          }
        }),
        catchError(this.handleError),
    )
  }

}
