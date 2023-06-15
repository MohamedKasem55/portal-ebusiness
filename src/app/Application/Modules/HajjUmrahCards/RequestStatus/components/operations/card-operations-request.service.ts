import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'

@Injectable()
export class CardOperationsRequestService extends AbstractListService {
  transformData = []

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const params = {
      order: order,
      orderType: orderType,
      page: page,
      rows: rows,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsOperationList',
      params,
    )
  }

  public requestStatusCardsOperationDetails(
    selectedOperations,
  ): Observable<any> {
    const params = {
      selectedOperations: selectedOperations,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsOperationDetails',
      params,
    )
  }

  public requestStatusCardsOperationDelete(
    selectedOperations,
  ): Observable<any> {
    const params = {
      selectedOperations: selectedOperations,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsOperationDelete',
      params,
    )
  }

  public requestStatusCardsOperationValidate(
    address,
    amount,
    city,
    country,
    email,
    mobileKSA,
    mobileNumber,
    newCardNumber,
    postalCode,
    stateRegion,
    selectedOperations,
  ): Observable<any> {
    const params = {
      address: address,
      amount: amount,
      city: city,
      country: country,
      email: email,
      mobileKSA: mobileKSA,
      mobileNumber: mobileNumber,
      newCardNumber: newCardNumber,
      postalCode: postalCode,
      stateRegion: stateRegion,
      batchDTO: selectedOperations,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsOperationValidate',
      params,
    )
  }

  public requestStatusCardsOperationConfirm(
    batchDTO,
    requestValidate,
  ): Observable<any> {
    const data = {
      batchDTO: batchDTO,
      requestValidate,
    }
    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsOperationConfirm',
      data,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return _body.listOperationsDSO
  }
}
