import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { AppService } from '../../../../core/service/app.service'
import { Exception } from 'app/Application/Model/exception'
import { TransferLocalInit } from '../Model/transferLocalInit'

@Injectable()
export class TransferLocalService extends AppService {
  servicesUrl: string
  currentUser

  constructor(private http: HttpClient, public config: ConfigResourceService) {
    super()
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
    const data = {}

    return this.http
      .get(this.servicesUrl + '/transfers/local/initiate', data)
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
            return <TransferLocalInit>output
          }
        }),
        catchError(this.handleError),
      )
  }

  validateAmount(
    beneficiaries: any[],
    transfer: any[],
    accounts: any,
    segment: string,
  ): Observable<any> {
    const data = {
      listBeneficiaries: beneficiaries,
      listTransfersLocal: [],
      operationDate: new Date(),
      segment,
    }
    for (let i = 0; i < transfer.length; i++) {
      data.listTransfersLocal.push({
        accountForm: accounts[transfer[i].accountFrom],
        amount: transfer[i].amount, //(number, optional),
        currency: accounts[transfer[i].accountFrom].currency,
        email: transfer[i].email, //(string, optional),
        remarks: transfer[i].additional1, //(string, optional)
      })
    }

    return this.http
      .post(this.servicesUrl + '/transfers/local/validate', data)
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
      )
  }

  finalizeInit(batchs, requestValidate): Observable<any> {
    const data = {
      batchList: batchs.checkAndSeparateInitiatitionPermission,
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
      typeBatchList: 'batchListSelectedLocal',
    }

    //console.log(body);
    return this.http
      .post(this.servicesUrl + '/transfers/local/confirm', data)
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
