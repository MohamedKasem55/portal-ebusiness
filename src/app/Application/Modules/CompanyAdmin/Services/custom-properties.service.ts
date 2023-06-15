import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestValidate } from 'app/Application/Model/requestvalidateType';
import { Observable } from 'rxjs';
import { catchError, map } from "rxjs/operators";
import { ConfigResourceService } from '../../../../core/config/config.resource.local';
import { AbstractService } from "../../Common/Services/Abstract/abstract.service";
import { AccountBatchList, RequestUpdateCompanyLimits, RequestValidateCompanyLimits } from '../Component/custom-properties/custom-properties-Models';

@Injectable()
export class CustomPropertiesService extends AbstractService {
  servicesUrl: string

  constructor(
    public config: ConfigResourceService,
    public http: HttpClient) {
    super(http, config)
    this.servicesUrl = config.getServicesUrl()
  }

  public getCompanyParameters(): Observable<any> {
    return this.http.get(
      this.servicesUrl + '/managementCompany/getCompanyParameters',
    )
  }

  public updateCompanyParameters(data: any): Observable<any> {
    return this.http.post(
      this.servicesUrl + '/managementCompany/updateCompanyParameters',
      data,
    )
  }

  public getCompanyMaximumAmount(): Observable<any> {

    return this.http.get(
        this.servicesUrl + '/managementCompany/getCompanyLimits',
    )

  }

  validateCompanyLimit(data: RequestValidateCompanyLimits): Observable<any> {
    const endPoint: string = '/managementCompany/validateCompanyLimits';
    return this.doPost(this.servicesUrl + endPoint, data)

  }

  public updateCompanyLimit(batchList: AccountBatchList, requestValidate: RequestValidate): Observable<any> {
    const endPoint: string = '/managementCompany/confirmCompanyLimits';
    const data: RequestUpdateCompanyLimits = new RequestUpdateCompanyLimits();
    data.accountBatchList = batchList
    data.requestValidate = requestValidate

    return this.http.post(
      this.servicesUrl + endPoint, data,
    )

  }

  public incrementTries(data: any): Observable<any> {
    return this.http.put(
      this.servicesUrl + '/managementCompany/incrementTries',
      data,
    )
  }

  getCompanyWorkflowTypesModel(): Observable<any> {
    const data = {
      name: 'companyWorkflowTypes'
    }

    return this.http.post(this.servicesUrl + '/statics/model', data).pipe(
      map((response: any) => {
        if (response.props) {
          const result = []
          for (const _prop in response.props) {
            if (_prop)
              result.push({ key: _prop, value: response.props[_prop] })
          }
          return result
        }
      }),
      catchError(this.handleError),
    )
  }

}
