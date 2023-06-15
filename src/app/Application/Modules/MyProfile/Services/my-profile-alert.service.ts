import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { forkJoin, Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../Application/Model/exception'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'
import { StorageService } from '../../../../core/storage/storage.service'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { ModelServiceAccount } from '../Model/my-profile-account-service.model'
import { ModelServiceAlertNotification } from '../Model/my-profile-alert-notification-service.model'
import { ModelServiceAlert } from '../Model/my-profile-alert-service.model'
import { ModelServiceCreateAlert } from '../Model/my-profile-createAlerts-service.model'
import { ModelServiceModifyAlert } from '../Model/my-profile-modificationAlert-service.model'

@Injectable()
export class MyProfileAlertService {
  token: string
  serviceUrl: string

  languages = {
    '1': 'ar',
    '2': 'en',
    ar: 'ar',
    en: 'en',
  }

  constructor(
    private http: HttpClient,
    public config: ConfigResourceService,
    public storageService: StorageService,
  ) {
    // set token if saved in local storage

    this.serviceUrl = config.getServicesUrl()
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

  public getAlertList(
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const data = {
      order,
      orderType,
      page,
      rows,
    }

    return this.http.post(this.serviceUrl + '/alerts', data).pipe(
      map((response: any) => {
        const body = response
        if (response.errorCode !== '0') {
          //console.log("Error code != 0");
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return errorService
        } else {
          return this.responseToPagedData(body, page, rows)
        }
      }),
      catchError(this.handleError),
    )
  }

  private responseToPagedData(
    body: any,
    page: number,
    rows: number,
  ): PagedData<ModelServiceAlert> {
    const output = body.accountWithAlertsList
    const pagedData = new PagedData<ModelServiceAlert>()
    const pageObject = new Page()

    pageObject.pageNumber = page
    pageObject.pageSize = rows
    pageObject.size = body.size
    pageObject.totalElements = body.total
    pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

    for (let i = 0; i < pageObject.size; i++) {
      const jsonObj = output[i]
      const notificationes = new Array<ModelServiceAlertNotification>()
      if (jsonObj.notificationsList) {
        for (let j = 0; j < jsonObj.notificationsList.size; j++) {
          const jsonObjNot = jsonObj.notificationsList[j]
          const notification = new ModelServiceAlertNotification(
            jsonObjNot.arabicDescription,
            jsonObjNot.defaultValue,
            jsonObjNot.englishDescription,
            jsonObjNot.maxValidationAmount,
            jsonObjNot.minValidationAmount,
            jsonObjNot.notificationAmount,
            jsonObjNot.notificationFlag,
            jsonObjNot.notificationType,
          )
          notificationes.push(notification)
        }
      }
      const list = new ModelServiceAlert(
        jsonObj.accountNumber,
        jsonObj.language,
        jsonObj.mobile,
        jsonObj.notificationAmountType,
        notificationes,
        jsonObj.notificationsNumber,
        jsonObj.subscriptionDate,
        jsonObj.subscriptionType,
      )
      pagedData.data.push(list)
    }
    pagedData.page = pageObject
    return pagedData
  }

  deleteAlert(account: Array<any>): Observable<any> {
    const data = {
      deleteAccountList: account,
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.serviceUrl + '/alerts/delete', { params: _param })
      .pipe(
        map((response: any) => {
          //console.log( response );
          const body = response
          //console.log( body );
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  editAlert(account: Array<ModelServiceModifyAlert>): Observable<any> {
    const observables = []
    for (let i = account.length - 1; i >= 0; i--) {
      observables.push(this.edit(account[i]))
    }
    return forkJoin(observables)
  }

  edit(account: ModelServiceModifyAlert): Observable<String> {
    const data = {
      accountToModify: account.notificationAccount,
      language: this.languages[account.language]
        ? this.languages[account.language]
        : account.language,
      notificationList: [],
      originalNotificationList: [],
    }
    //
    for (let i = 0; i < account.notifications.length; i++) {
      //console.log(account.notifications[i]);

      data.notificationList.push({
        arabicDescription: account.notifications[i].arabicDescription,
        defaultValue: account.notifications[i].defaultValue,
        englishDescription: account.notifications[i].englishDescription,
        maxValidationAmount: account.notifications[i].maxValidationAmount,
        minValidationAmount: account.notifications[i].minValidationAmount,
        notificationAmount: account.notifications[i].notificationFlag
          ? this.revertTransformValue(
              account.notifications[i].notificationAmount,
            )
          : 0,
        notificationFlag: account.notifications[i].notificationFlag ? 'Y' : 'N',
        notificationType: account.notifications[i].notificationType,
      })
      //console.log(account.originalNotifications[i]);
      data.originalNotificationList.push({
        arabicDescription: account.originalNotifications[i].arabicDescription,
        defaultValue: account.originalNotifications[i].defaultValue,
        englishDescription: account.originalNotifications[i].englishDescription,
        maxValidationAmount:
          account.originalNotifications[i].maxValidationAmount,
        minValidationAmount:
          account.originalNotifications[i].minValidationAmount,
        notificationAmount: account.originalNotifications[i].notificationAmount,
        notificationFlag: account.originalNotifications[i].notificationFlag
          ? 'Y'
          : 'N',
        notificationType: account.originalNotifications[i].notificationType,
      })
    }

    //console.log('Vamos a editar: '+body);
    return this.http.put(this.serviceUrl + '/alerts/modify', data).pipe(
      map((response: any) => {
        //console.log( response );
        const body = response
        //console.log( body );
        return body || {}
      }),
      catchError(this.handleError),
    )
  }

  getCreateAlertData(): Observable<any> {
    return this.http.get(this.serviceUrl + '/alerts/add').pipe(
      map((response: any) => {
        const body = response
        //console.log(body)
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return errorService
        } else {
          return this.responseToModelCreateAlert(body)
        }
      }),
      catchError(this.handleError),
    )
  }

  private responseToModelCreateAlert(body: any): ModelServiceCreateAlert {
    const result = new ModelServiceCreateAlert()
    const outputAccounts = body.listAccountWithoutAlerts
    //console.log('numero de cuentas '+body.listAccountWithoutAlerts.length);
    for (let j = 0; j < outputAccounts.length; j++) {
      const jsonObj = outputAccounts[j]
      //console.log('itero sobre: '+jsonObj.numberAccount);
      result.accounts.set(
        jsonObj.fullAccountNumber,
        new ModelServiceAccount(
          jsonObj.account15Length,
          jsonObj.fullAccountNumber,
          jsonObj.accountPk,
          jsonObj.alias,
          jsonObj.availableBalance,
          jsonObj.availableSarBalance,
          jsonObj.branchName,
          jsonObj.branchid,
          jsonObj.checkDigit,
          jsonObj.code000,
          jsonObj.companyPk,
          jsonObj.currency,
          jsonObj.erNumber,
          jsonObj.exchangeRate,
          jsonObj.fullAccountNumber,
          jsonObj.ibanNumber,
          jsonObj.inquiry,
          jsonObj.ledgerBalance,
          jsonObj.modified,
          jsonObj.numberAccount,
          jsonObj.payment,
          jsonObj.status,
          jsonObj.txAccountString,
          jsonObj.typeAccount,
          jsonObj.typeFunction,
          jsonObj.unclearedBalance,
        ),
      )
    }
    const outputNotification = body.notificationList
    for (let i = 0; i < outputNotification.length; i++) {
      const jsonObj = outputNotification[i]
      result.notifications.push(
        new ModelServiceAlertNotification(
          jsonObj.arabicDescription,
          jsonObj.defaultValue,
          jsonObj.englishDescription,
          jsonObj.maxValidationAmount,
          jsonObj.minValidationAmount,
          jsonObj.notificationAmount,
          jsonObj.notificationFlag == 'Y' ? true : false,
          jsonObj.notificationType,
        ),
      )
    }
    result.mobile = body.mobile
    return result
  }

  public addAlert(
    alert: ModelServiceAccount,
    language: string,
    notifications: Array<ModelServiceAlertNotification>,
  ) {
    const notif = []
    //console.log(notifications);

    notifications.forEach((value) => {
      //
      if (value.notificationFlag) {
        notif.push({
          defaultValue: value.notificationAmount,
          notificationType: value.notificationType,
          notificationAmount: value.notificationAmount,
        })
      }
    })

    const data = {
      listAccountWithoutAlertsSelected: [alert],
      language: this.languages[language] ? this.languages[language] : language,
      notificationList: notif,
    }

    //console.log(' Json '+body);
    //console.log('Dar de alta: '+body);
    return this.http.post(this.serviceUrl + '/alerts/add', data).pipe(
      map((response: any) => {
        const body = response
        //console.log('response: '+ body );
        return body || {}
      }),
      catchError(this.handleError),
    )
  }

  getModifiedAccounts(accountNumber): Observable<ModelServiceModifyAlert> {
    return this.http
      .get(this.serviceUrl + '/alerts/modify/' + accountNumber)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            //console.log("errorCode !== "0""+response.errorCode);
            //return this.responseToModelServiceModifyAlert(MockDataModifyAccount);
            return null
          } else {
            return this.responseToModelServiceModifyAlert(body)
          }
        }),
        catchError(this.handleError),
      )
  }

  responseToModelServiceModifyAlert(body): ModelServiceModifyAlert {
    const notifications = []
    const originalNotifications = []
    const outputNotification = body.notificationList
    for (let i = 0; i < outputNotification.length; i++) {
      const jsonObj = outputNotification[i]
      notifications.push(
        new ModelServiceAlertNotification(
          jsonObj.arabicDescription,
          jsonObj.defaultValue,
          jsonObj.englishDescription,
          jsonObj.maxValidationAmount,
          jsonObj.minValidationAmount,
          jsonObj.notificationAmount,
          jsonObj.notificationFlag == 'Y' ? true : false,
          jsonObj.notificationType,
        ),
      )
      originalNotifications.push(
        new ModelServiceAlertNotification(
          jsonObj.arabicDescription,
          jsonObj.defaultValue,
          jsonObj.englishDescription,
          jsonObj.maxValidationAmount,
          jsonObj.minValidationAmount,
          jsonObj.notificationAmount,
          jsonObj.notificationFlag == 'Y' ? true : false,
          jsonObj.notificationType,
        ),
      )
    }
    const result = new ModelServiceModifyAlert(
      body.notificationAccount,
      body.language,
    )
    result.notifications = notifications
    result.originalNotifications = originalNotifications
    result.mobile = body.mobile
    return result
  }

  revertTransformValue(value) {
    if (value && typeof value == 'string') {
      const valueInput = value.replace(/,/g, '')
      if (!isNaN(Number(valueInput))) {
        value = Number(valueInput)
      }
    }
    return value
  }
}
