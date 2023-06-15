import { Injectable } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AbstractService } from '../../Common/Services/Abstract/abstract.service'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { map } from 'rxjs/operators'
import { SimpleMQ } from 'ng2-simple-mq'

@Injectable()
export class FinanceProductDetailsService extends AbstractService {
  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected fb: FormBuilder,
    private smq: SimpleMQ,
  ) {
    super(http, config)
  }

  public createFinalOfferForm(data, financeID, productCode): FormGroup {
    return this.fb.group({
      financeID: [financeID, []],
      financeAmount: [data.offer.financeAmt, []],
      tenure: [data.offer.tenure, []],
      instalmentAmount: [data.offer.installmentAmt, []],
      contractNumber: [financeID, []],
      accountNumber: [data.offer.acctNum, []],
      totalProfit: [data.offer.profit, []],
      totalAmount: [data.creditLine.totalAmt, []],
      annualProfitRate: [data.creditLine.profitRate + '%', []],
      fees: [data.offer.fees + '%', []],
      monthInstalmentAmount: [data.offer.installmentAmt, []],
      currency: ['SAR', []],
      requiredAmt: [data.trackingData.requiredAmt, []],
      requestDate: [new Date(data.offer.contractDate.startDate), []],
      applicationStatus: [data.trackingData.statusDesc, []],
      applicationType: [data.trackingData.productKey.macroFacility, []],
      cardLimit: [data.trackingData.requiredAmt, []],
      productCode: [productCode, []],
    })
  }

  public createCommodityForm(data, dosierID, productCode): FormGroup {
    return this.fb.group({
      financeAmount: [data.amount, []],
      currency: ['SAR', []],
      commodityValue: [data.commodityAmt, []],
      dateOfPurchase: [data.settlementDate, []],
      commodityAmount: [data.commodityQuantity + ' KG', []],
      acceptContract: [false, []],
      iAuthorizeCommodity: [false, []],
      promissoryDate: ['', []],
      financeID: [dosierID, []],
      contractDownloaded: [false, []],
      bankTrxnRef: ['', []],
      productCode: [productCode, []],
    })
  }

  public getContractList(category) {
    return this.http
      .post(this.servicesUrl + '/finance/contractList', { category })
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        })
      )
  }

  public getContractDetails(dosierID) {
    return this.http
      .get(this.servicesUrl + '/finance/getContractDetails/' + dosierID)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public getInstallmentDetails(dosierID) {
    return this.http
      .get(this.servicesUrl + '/finance/getInstallmentList/' + dosierID)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public getTrackingDataInquiry(dosierID) {
    return this.http
      .get(this.servicesUrl + '/finance/trackingDataInquiry/' + dosierID)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public rejectCreditLineDosier(dosierID) {
    return this.http
      .post(
        this.servicesUrl + '/finance/rejectCreditLineDosier/' + dosierID,
        {},
      )
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public openDisbursmentDossier(dossierID, financeProductCode, accountNumber) {
    const data = {
      dossierID,
      financeProductCode,
      accountNumber,
    }
    return this.http
      .post(this.servicesUrl + '/finance/openDisbursmentDossier', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public buyCommodity(dossierID, financeProductCode) {
    const data = {
      commidityRequest: {
        dossierID,
        financeProductCode,
      },
    }
    return this.http
      .post(this.servicesUrl + '/finance/buyCommodity', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        })
      )
  }

  public initiateSellCommodity() {
    return this.http
      .post(this.servicesUrl + '/finance/initiateSellCommodity', {})
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public getCommodityDetails(dossierID) {
    return this.http
      .get(this.servicesUrl + '/finance/getCommodityDetails/' + dossierID)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public sellCommodity(dossierID, financeProductCode, otp) {
    const data = {
      commidityRequest: {
        dossierID,
        financeProductCode,
      },
      requestValidate: otp,
    }
    return this.http
      .post(this.servicesUrl + '/finance/sellCommodity', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public createSanadGroup(dossierId) {
    const data = {
      dossierId,
    }
    return this.http
      .post(this.servicesUrl + '/sanad/createSanadGroup', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public setSanadPNCreation(dossierID, financeProductCode) {
    const data = {
      dossierID,
      financeProductCode,
    }
    return this.http
      .post(this.servicesUrl + '/sanad/setSanadPNCreation', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        }),
      )
  }

  public getPrintableDocuments(doc, dosierId, fileName, productCode) {
    const output = {
      file: new Blob(),
      fileName: doc,
    }
    const data = {
      reportName: doc,
      productCode,
      dosierId,
    }

    return this.http
      .post(this.servicesUrl + '/finance/getPrintableDocuments', data, {
        responseType: 'blob',
      })
      .pipe(
        map((res: any) => {
          if (res.errorCode || res.type != 'application/pdf') {
            res.text().then((text) => {
              let value = JSON.parse(text)
              this.smq.publish(
                'error-mq',
                value.errorDescription + '|' + value.errorResponse.reference,
              )
            })
            return null
          } else {
            output.file = res
            output.fileName = fileName
            return output
          }
        }),
      )
  }

  public initiateDigitalSignature(digitalSignatureActions, identifier) {
    return this.http
      .post(
        this.servicesUrl + '/digitalSignature/initiate',
        { digitalSignatureActions, identifier },
      )
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            return null
          } else {
            return response
          }
        })
      )
  }
  public getDigitalSignatureStatus(bankTrxnRef) {
    return this.http
      .post(
        this.servicesUrl + '/digitalSignature/status',
        { bankTrxnRef },
      )
      .pipe(
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
