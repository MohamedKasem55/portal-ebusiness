import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Exception } from '../../../Model/exception'
import { TransferInternationalInit } from '../Model/transferInternationalInit'

@Injectable()
export class TransferInternationalService {
  servicesUrl: string
  currentUser

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    this.servicesUrl = config.getServicesUrl()
  }

  public handleError(error: HttpResponse<any> | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string
    if (error instanceof HttpResponse) {
      const err = error['error'] || JSON.stringify(error)
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`
    } else {
      errMsg = error.message ? error.message : error.toString()
    }
    console.error(errMsg)
    const errorService: Exception = new Exception('handle', errMsg)
    return observableThrowError(errorService)
  }

  transferInit(): Observable<any> {
    const data = {
      listBeneficiaries: [],
    }

    return this.http
      .post(this.servicesUrl + '/transfers/international/initiate', data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(exception)
          } else {
            const output = response
            return <TransferInternationalInit>output
          }
        }),
        catchError(this.handleError),
      )
  }

  transferPropose(beneficiary: any, remitterCategory: any): Observable<any> {
    const data = {
      beneficiaryCategory:
        beneficiary['beneficiaryCategory'] === 'C' ? '0002' : '0001',
      //currencyCode : currency,
      payCode: beneficiary['payCode'],
      remitterCategory,
    }

    return this.http
      .post(this.servicesUrl + '/transfers/international/reasons', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  transferCurrency(selectedAccount: any, beneficiaryCurrency: any): Observable<any> {

    const data = {
      selectedAccount: selectedAccount,
      beneficiaryCurrency: beneficiaryCurrency,
    }

    return this.http.post(this.servicesUrl + '/transfers/international/currency', data)
        .pipe(
            map((response: any) => {
              const body = response
              if (response.errorCode !== '0') {
                const exception: Exception = new Exception(
                    body.errorCode,
                    body.errorDescription,
                )
                return exception
              } else {
                const output = body
                return output
              }
            }),
            catchError(this.handleError),
        )
  }

  validateAmount(
    beneficiaries: any[],
    transfer: any[],
    accounts: any,
    segm: any,
    remitterCategory: any,
  ): Observable<any> {
    for (let i = 0; i < beneficiaries.length; i++) {
      beneficiaries[i].beneficiaryAccountFrom =
        accounts[transfer[i].accountFrom]
    }

    const data = {
      listBeneficiaries: beneficiaries,
      transferIntList: [],
      segment: segm,
      operationDate: new Date(),
      remitterCategory,
    }

    for (let i = 0; i < transfer.length; i++) {
      const purpose = JSON.parse(transfer[i].propose)
      data.transferIntList.push({
        accountFrom: accounts[transfer[i].accountFrom].fullAccountNumber,
        additionalInfo1: transfer[i].additional1,
        additionalInfo1Lbl: purpose.additionalInfo1,
        additionalInfo2: transfer[i].additional2,
        additionalInfo2Lbl: purpose.additionalInfo2,
        additionalInfoFlag: purpose.additionalInfoFlag,
        amount: transfer[i].amount, //(number, optional),
        currency: transfer[i].currency,
        email: transfer[i].email, //(string, optional),
        payType: beneficiaries[i].payCode,
        transferReason: purpose.purposeCode,
        transferReasonLbl: 'prupose',
        remarks: transfer[i].remarks, //(string, optional)
      })
    }

    const req = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/transfers/international/validate', req)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }

  finalizeInit(batchs, requestValidate): Observable<any> {
    const data = {
      batchList: {
        toProcess: batchs.checkAndSeparateInitiatitionPermission.toProcess,
        toAuthorize: batchs.checkAndSeparateInitiatitionPermission.toAuthorize,
        notAllowed: batchs.checkAndSeparateInitiatitionPermission.notAllowed,
        anyAllowed: true,
      }, //batchs.checkAndSeparateInitiatitionPermission,
      totalAmountProcess: batchs.totalAmountProcess,
      listbatchToDelete: [],
      emailChecked: '',
      requestValidate: {
        challengeNumber:
          batchs.generateChallengeAndOTP &&
          'CHALLENGE' == batchs.generateChallengeAndOTP.typeAuthentication
            ? requestValidate.challengeNumber
            : '',
        challengeResponse:
          batchs.generateChallengeAndOTP &&
          'CHALLENGE' == batchs.generateChallengeAndOTP.typeAuthentication
            ? requestValidate.challengeResponse
            : '',
        otp:
          batchs.generateChallengeAndOTP &&
          'OTP' == batchs.generateChallengeAndOTP.typeAuthentication
            ? requestValidate.otp
            : '',
        password:
          batchs.generateChallengeAndOTP &&
          'STATIC' == batchs.generateChallengeAndOTP.typeAuthentication
            ? requestValidate.password
            : '',
      },
      typeBatchList: 'batchListSelectedInternational',
    }

    return this.http
      .post(this.servicesUrl + '/transfers/international/confirm', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
              body.generateChallengeAndOTP,
            )
            return exception
          } else {
            const output = body
            return output
          }
        }),
        catchError(this.handleError),
      )
  }
}
