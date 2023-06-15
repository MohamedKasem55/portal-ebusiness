import { ViewCardCredentialsData } from './../../../ViewCardCredentials/view-card-credentials.models';
import { HttpClient } from '@angular/common/http';
import { ConfigResourceService } from 'app/core/config/config.resource.local';
import { Observable } from 'rxjs';
import { AbstractService } from '../Abstract/abstract.service';
import { RequestValidate } from 'app/Application/Model/requestvalidateType';
import { Injectable } from '@angular/core';


@Injectable()
export class ViewCardCredentialsService extends AbstractService {
  public static SolePropiertorship = ['0018', '0022']
  public static MadaCards = 'MC'
  public static BusinessCards = 'BC'
  public static PrepaidCards = 'PC'
  public viewCardCredentialsData: ViewCardCredentialsData;
  constructor(public config: ConfigResourceService, public http: HttpClient) {
    super(http, config)
  }
  public sendMessage(): Observable<any> {
    return this.doGet(this.servicesUrl + '/cardDetailCredentials/sendOTPCardCredentials')
  }

  public validateOTP(requestValidate: RequestValidate, cardDetails: any): Observable<any> {

    const data = {
      requestValidate,
      cardNumber: cardDetails.cardNum ? cardDetails.cardNum : null,
      cardSeqNumber: cardDetails.cardSeqNum ? cardDetails.cardSeqNum : null,
      details: true
    }

    return this.doPost(this.servicesUrl + '/cardDetailCredentials/validateOTPCardCredentials', data)
  }

  public setViewCardCredentialsData(viewCardCredentialsData: ViewCardCredentialsData) {
    this.viewCardCredentialsData = viewCardCredentialsData
  }
  public getViewCardCredentialsData(): ViewCardCredentialsData {
    return this.viewCardCredentialsData;
  }

  public getCompanyJuridicalState(): Observable<any> {
    return this.doGet(this.servicesUrl + '/companyDetails/juridicalState')
  }

}