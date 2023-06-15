import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { Exception } from '../../../../Application/Model/exception'
import { Page } from '../../../../Application/Model/page'
import { PagedData } from '../../../../Application/Model/paged-data'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Injectable()
export class ManageUserService {
  servicesUrl: string

  civili = null
  employeeNumber = null
  employeeName = null
  dataB: any

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

  //Mirar la salida, de momento adaptado para que siga como antes.
  public getUserList(
    datos,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      mobile: datos.mobile, //"string",
      userName: datos.userName, //"string",
      userId: datos.userId, //"string",
      //order: order,
      //orderType: orderType,
      page: pageNumber, //0,
      rows, //0,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/user/list', data)
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
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.listUsers.size
            page.totalElements = output.listUsers.total
            page.totalPages = page.totalElements / page.size
            const size = output.size
            pagedData.page = page
            pagedData.data = output.listUsers.items
            output.listUsers.items.forEach((item) => {
              item['numberTerminal'] = item.userPosTerminals
                ? item.userPosTerminals.length
                : 0
            })
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public getNewUserList(
    datos,
    pageNumber,
    rows,
    order,
    orderType,
  ): Observable<any> {
    const data = {
      mobile: datos.mobile, //"string",
      userName: datos.userName, //"string",
      //order: order,
      //orderType: orderType,
      page: pageNumber, //0,
      rows, //0,
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/user/listWithoutPos', data)
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
            const pagedData = new PagedData<any>()
            const page = new Page()
            page.pageNumber = pageNumber
            page.pageSize = rows
            page.size = output.listUsers.size
            page.totalElements = output.listUsers.total
            page.totalPages = page.totalElements / page.size
            const size = output.size
            pagedData.page = page
            pagedData.data = output.listUsers.items
            return pagedData
          }
        }),
        catchError(this.handleError),
      )
  }

  public changePassword(user, passwords) {
    const data = {
      newPassword: passwords.password,
      userPosPk: user.userPosPk,
    }
    //console.log(data,passwords);
    return this.http
      .post(this.servicesUrl + '/posManagement/user/resetPassword', data)
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

  public deleteUser(user: any): Observable<any> {
    const data = {
      userPos: user[0],
    }

    let _param: HttpParams = new HttpParams()
    _param = _param.append('deletebody', JSON.stringify(data))

    return this.http
      .delete(this.servicesUrl + '/posManagement/user/delete', {
        params: _param,
      })
      .pipe(
        map((response: any) => {
          const body = response
          return body || {}
        }),
        catchError(this.handleError),
      )
  }

  public confirmEmployees(datos): Observable<any> {
    const data = {
      userPos: {
        companyUserFk: null,
        mobile: datos.mobile,
        password: 'string',
        tries: 0,
        userId: datos.userId,
        userName: datos.userName,
        userPosPk: 0,
        userPosTerminals: null,
      },
    }

    return this.http
      .post(this.servicesUrl + '/posManagement/user/addNew', data)
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
}
