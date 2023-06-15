import { Observable } from 'rxjs'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'

@Injectable()
export class CardAllocationRequestService extends AbstractListService {
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
      this.servicesUrl + '/hajjumra/requestStatusCardsAllocatedList',
      params,
    )
  }

  public requestStatusCardsAllocatedDetails(
    selectedOperation,
  ): Observable<any> {
    const params = {
      selectedOperation: selectedOperation,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsAllocatedDetails',
      params,
    )
  }

  public requestStatusCardsAllocatedDelete(selectedOperation): Observable<any> {
    const params = {
      selectedOperation: selectedOperation,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsAllocatedDelete',
      params,
    )
  }

  public requestStatusCardsAllocatedValidate(
    address,
    city,
    country,
    email,
    mobileKSA,
    mobileNumber,
    passportNumber,
    postalCode,
    stateRegion,
    selectedOperations,
  ): Observable<any> {
    const params = {
      address: address,
      city: city,
      country: country,
      email: email,
      mobileKSA: mobileKSA,
      mobileNumber: mobileNumber,
      passportNumber: passportNumber,
      postalCode: postalCode,
      stateRegion: stateRegion,
      batchDTO: selectedOperations,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsAllocatedValidate',
      params,
    )
  }

  public requestStatusCardsAllocatedConfirm(
    batchDTO,
    requestValidate,
  ): Observable<any> {
    const data = {
      batchDTO: batchDTO,
      requestValidate,
    }
    return this.http.post(
      this.servicesUrl + '/hajjumra/requestStatusCardsAllocatedConfirm',
      data,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return _body.listAllocationDTO
  }
}
