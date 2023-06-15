import { Injectable } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Observable } from 'rxjs'
import { AbstractService } from '../../Common/Services/Abstract/abstract.service'
import { map } from 'rxjs/operators'
import { CommonValidators } from '../../Common/constants/common-validators.service'

@Injectable()
export class URPayService extends AbstractService {
  constructor(
    protected http: HttpClient,
    protected fb: FormBuilder,
    public config: ConfigResourceService,
    public commonValidators: CommonValidators,
  ) {
    super(http, config)
  }

  public createForm(type): FormGroup {
    return this.fb.group({
      wallet: type == 'phone' ? ['', [Validators.required, Validators.pattern(this.commonValidators.URpayMobilePattern)]] :
        ['SA', [Validators.required, Validators.minLength(this.commonValidators.IbanLength), Validators.maxLength(this.commonValidators.IbanLength), Validators.pattern(this.commonValidators.URpayVIBANPattern)]],
      type: [type, []],
      account: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1)]],
      // purpose: ['', [Validators.required]],
      details: ['', []],
      walletCustomerName: [{ value: '', disable: true }, []],
    })
  }

  public getAccounts(): Observable<any> {
    return this.http.get(this.servicesUrl + '/accounts/nicknameList', {
      params: {},
    }).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response.listAccount
        }
      }),
    )
  }

  public getTransferPurpose(): Observable<any> {
    return this.http.post(this.servicesUrl + '/transfers/reasons', {
      transferPurposeType: 'LOCAL',
    }).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response.transferReasonsList
        }
      }),
    )
  }

  public validateTopUp(data): Observable<any> {
    return this.http.post(this.servicesUrl + '/urPay/validateTopUp', data).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }


  public initiateTopUp(data): Observable<any> {
    return this.http.post(this.servicesUrl + '/urPay/confirmTopUp', data).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }

  public getCustomerDetails(data): Observable<any> {
    return this.http.post(this.servicesUrl + '/urPay/customerDetails', data).pipe(
      map((response: any) => {
        if (response.errorCode !== '0') {
          return null
        } else {
          return response
        }
      }),
    )
  }
}


