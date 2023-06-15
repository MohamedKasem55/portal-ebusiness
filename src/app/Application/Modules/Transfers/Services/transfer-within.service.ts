import { HttpClient, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { Beneficiary } from '../../../Model/beneficiary'
import { Exception } from 'app/Application/Model/exception'
import { ConfirmWithinSave } from '../Model/confirm-save-within'
import { TransferInit } from '../Model/transferInit'
import { WithinTransferBatch } from '../Model/withinTransferBatch'

@Injectable()
export class TransferWithinService {
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
    const data = {}

    return this.http
      .get(this.servicesUrl + '/transfers/within/initiate', data)
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
            return <TransferInit>output
          }
        }),
        catchError(this.handleError),
      )
  }

  confirmSave(
    beneficiaries: Beneficiary[],
    transfer: any,
    batchPk: number,
  ): Observable<any> {
    const data = {
      listBeneficiaries: beneficiaries,
      operationDate: new Date(),
    }
    data['listTransfersWithn'] = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < transfer.length; i++) {
      data['listTransfersWithn'].push({
        accountForm: transfer[i].accoutnFrom,
        accountNumberTo: transfer[i].accountTo, //(string, optional),
        amount: transfer[i].amount, //(number, optional),
        batchPk, //(string, optional),
        email: transfer[i].email, //(string, optional),
        remarks: transfer[i].additional1, //(string, optional)
      })
    }

    const body = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/transfers/within/confirmSave', body)
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
            return output as ConfirmWithinSave
          }
        }),
        catchError(this.handleError),
      )
  }

  finalizeSave(batchs: WithinTransferBatch[]): Observable<any> {
    const data = {
      listPaymentDetails: batchs,
    }

    const body = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/transfers/within/finalizeSave', body)
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
            return <ConfirmWithinSave>output
          }
        }),
        catchError(this.handleError),
      )
  }

  confirmInit(
    beneficiaries: Beneficiary[],
    transfer: any,
    accounts: any,
  ): Observable<any> {
    const data = {
      listBeneficiaries: beneficiaries,
      operationDate: new Date(),
    }
    data['listTransfersWithn'] = []
    for (let i = 0; i < transfer.length; i++) {
      data['listTransfersWithn'].push({
        accountForm: accounts[transfer[i].accountFrom],
        accountNumberTo: beneficiaries[i].beneficiaryAccountCode, //(string, optional),
        amount: transfer[i].amount, //(number, optional),
        email: transfer[i].email, //(string, optional),
        remarks: transfer[i].additional1, //(string, optional)
      })
    }

    const body = JSON.stringify(data)
    //console.log(body);
    return this.http
      .post(this.servicesUrl + '/transfers/within/validate', body)
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
            return <ConfirmWithinSave>output
          }
        }),
        catchError(this.handleError),
      )
  }

  finalizeInit(batchs, requestValidate): Observable<any> {
    const data = {
      //modificar
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
      typeBatchList: 'batchListSelected',
    }

    const body = JSON.stringify(data)
    return this.http
      .post(this.servicesUrl + '/transfers/within/confirm', body)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const exception: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
              response.generateChallengeAndOTP,
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

  /*public validate(): Observable<any> {
        return this.http.get( this.servicesUrl + "/transfers/within/validateInitiate")
            .pipe(map(( response: any ) => {
                return response || {};
            } ),catchError( this.handleError ));
    }*/
}
