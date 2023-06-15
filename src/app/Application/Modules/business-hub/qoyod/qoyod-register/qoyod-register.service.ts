import { Injectable } from '@angular/core';
import {AbstractService} from "../../../Common/Services/Abstract/abstract.service";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { StorageService } from '../../../../../core/storage/storage.service'

@Injectable({
  providedIn: 'root'
})
export class QoyodRegisterService extends AbstractService {

  private SYS_ID = "QOYOD"
  servicesUrl: string
  businessHUbServicesUrl: string

  constructor(
      public config: ConfigResourceService,
      protected http: HttpClient,
      public fb: FormBuilder,
      private storageService: StorageService,
  ) {
    super(http, config)
    this.servicesUrl = config.getServicesUrl()
    this.businessHUbServicesUrl = config.businessHubServicesUrl
  }

  buildForm(data): FormGroup {
    return this.fb.group({
      fullName: [{ value: data.companyOwnerName, disabled: true }, [Validators.required]],
      email: [{
        value: this.storageService.retrieve('user').email,
        disabled: false
      },
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{1,15}$")
        ]
      ],
      mobileContact: [{ value: data.companyOwnerMobileNumber, disabled: true }, [Validators.required]],
      organizationName: [
        {
          value: this.storageService.retrieve('company').companyName,
          disabled: true
        },
        [Validators.required]
      ],
      fromAcct: [null, [Validators.required]],
      termsAccept: [false, [Validators.required]],
    })
  }

  hasAccess(): Observable<any>{
    return this.http.get(this.businessHUbServicesUrl + `/eBusinessHubStores/hasAccess/${this.SYS_ID}`).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  getConfig(): Observable<any>{
    return this.http.get(this.businessHUbServicesUrl + `/eBusinessHubStores/getConfig/${this.SYS_ID}`).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  getSARAccounts(): Observable<any> {
    return this.http.get(this.servicesUrl + '/userProfile/getSARAccounts').pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  initRegister(isRenew: boolean = false): Observable<any> {
    if(isRenew){
      return this.http.post(this.businessHUbServicesUrl + '/eBusinessHubStores/qoyodRenewalInitRegistration',{}).pipe(
          map((response: any) => response),
          catchError(this.handleError),
      )
    } else {
      return this.http.post(this.businessHUbServicesUrl + '/eBusinessHubStores/qoyodInitRegistration',{}).pipe(
          map((response: any) => response),
          catchError(this.handleError),
      )
    }
  }

  registerNew(data): Observable<any> {
    return this.http.post(this.businessHUbServicesUrl + '/eBusinessHubStores/qoyodRegisterNew', data).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  renewSubscription(data): Observable<any> {
    return this.http.post(this.businessHUbServicesUrl + '/eBusinessHubStores/qoyodRenewSubscription', data).pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  getOwnerDetails(): Observable<any> {
    return this.http.get(this.businessHUbServicesUrl + '/eBusinessHubStores/getOwnerDetails').pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }

  getCurrentSubscriptionDetails(): Observable<any> {
    return this.http.get(this.businessHUbServicesUrl + '/eBusinessHubStores/qoyodSubscriptionDetails').pipe(
        map((response: any) => response),
        catchError(this.handleError),
    )
  }
}
