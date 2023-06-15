import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AbstractListService } from '../../Common/Services/Abstract/abstract-list.service'
import { stringify } from 'querystring'

@Injectable()
export class CardOpeartionsService extends AbstractListService {
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
      cardReferenceNumber: criteria.cardNumber ? criteria.cardNumber : null,
      checkedToValidBatch: null,
      page: page,
      rows: rows,
      hajjUmrahCardsOption: null,
      nationalId: criteria.visa ? criteria.visa : null,
      order: null,
      orderType: null,
      searchFlag: true,
      selectedIncentiveCards: criteria.searchCategory
        ? criteria.searchCategory
        : null,
      status: criteria.status ? criteria.status : null,
      departmentCode: null,
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/listcardsOperation',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    return _body.cardIncentiveInstitutionsList
  }

  public authorizeValidate(checkedToValidBatch, operatType): Observable<any> {
    const data: any = {}
    data.checkedToValidBatch = checkedToValidBatch
    data.hajjUmrahCardsOption = operatType

    return this.http.post(
      this.servicesUrl + '/hajjumra/validateCardOperation',
      data,
    )
  }

  public authorizeConfirm(
    batchDTO,
    operatType,
    formData,
    requestValidate,
  ): Observable<any> {
    const data: any = {}
    data.batchDTO = {}
    data.batchDTO = batchDTO
    data.operationType = operatType
    data.requestValidate = requestValidate

    const refundAmountArray = []
    const loadAmountArray = []
    const cardNumberArray = []

    const addressArray = []
    const cityArray = []
    const emailArray = []
    const mobileKSAArray = []
    const passportNumberArray = []
    const mobileNumberArray = []
    const postalCodeArray = []
    const stateRegionArray = []

    for (let i = 0; formData.value.length > i; i++) {
      refundAmountArray.push(formData.value[i].refundAmount)
      loadAmountArray.push(formData.value[i].loadAmount)
      cardNumberArray.push(formData.value[i].cardNumber)
      addressArray.push(formData.value[i].address)
      cityArray.push(formData.value[i].city)
      emailArray.push(formData.value[i].email)
      mobileKSAArray.push(formData.value[i].mobileKSA)
      passportNumberArray.push(formData.value[i].passport)
      mobileNumberArray.push(formData.value[i].mobileNumber)
      postalCodeArray.push(formData.value[i].postalCode)
      stateRegionArray.push(formData.value[i].stateRegion)
    }
    if (batchDTO.toAuthorize.length > 0) {
      switch (operatType) {
        case 'PR':
          data.amountA = refundAmountArray
          break
        case 'LD':
          data.amountA = loadAmountArray
          break
        case 'SC':
          data.newCardNumberA = cardNumberArray
          break
        case 'UD':
          data.addressA = addressArray
          data.cityA = cityArray
          data.emailA = emailArray
          data.mobileKSAA = mobileKSAArray
          data.passportNumberA = passportNumberArray
          data.mobileNumberA = mobileNumberArray
          data.postalCodeA = postalCodeArray
          data.stateRegionA = stateRegionArray
          break
      }
    } else {
      switch (operatType) {
        case 'PR':
          data.amountP = refundAmountArray
          break
        case 'LD':
          data.amountP = loadAmountArray
          break
        case 'SC':
          data.newCardNumberP = cardNumberArray
          break
        case 'UD':
          data.addressP = addressArray
          data.cityP = cityArray
          data.emailP = emailArray
          data.mobileKSAP = mobileKSAArray
          data.passportNumberP = passportNumberArray
          data.mobileNumberP = mobileNumberArray
          data.postalCodeP = postalCodeArray
          data.stateRegionP = stateRegionArray
          break
      }
    }

    return this.http.post(
      this.servicesUrl + '/hajjumra/confirmCardOperation',
      data,
    )
  }
}
