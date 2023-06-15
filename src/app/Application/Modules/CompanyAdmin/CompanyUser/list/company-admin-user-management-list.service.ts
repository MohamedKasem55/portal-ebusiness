import { HttpClient } from '@angular/common/http'
import { Injectable, Injector } from '@angular/core'
import { Exception } from 'app/Application/Model/exception'
import { Page } from 'app/Application/Model/page'
import { PagedData } from 'app/Application/Model/paged-data'
import { AbstractService } from 'app/Application/Modules/Common/Services/Abstract/abstract.service'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { Observable, throwError as observableThrowError } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { CompanyUser } from '../../Model/company-user'
import { UserDetails } from '../../Model/userDetails'

@Injectable()
export class CompanyAdminUserManagementListService extends AbstractService {
  servicesUrl: string

  constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    private injector: Injector,
  ) {
    super(http, config)
  }

  getInit(): Observable<any> {

    return this.http.get(this.servicesUrl + "/userManagement/register/init").pipe(map((response: any, index: number) => {
      const body = response;
      if (response.errorCode !== "0") {
        const exception: Exception = new Exception(body.errorCode, body.errorDescription);
        return exception;
      }
      else {
        const output = body;
        return output;
      }
    }), catchError(this.handleError));

  }

  public detailsUser(userId): Observable<any> {
    const data = {}

    return this.http
      .get(this.servicesUrl + '/userManagement/details/' + userId, data)
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(errorService)
          } else {
            let resp: UserDetails
            resp = response
            resp.realGroup = {
              groupListOthers: [],
              groupListPayments: [],
              groupListTransfers: [],
              groupListBills: [],
              groupListCheckBook: [],
              groupListAramcoPayments: [],
              groupListPrePaidCards: [],
              groupListBusinessCards: [],
            }
            return resp
          }
        }),
        catchError(this.handleError),
      )
  }

  public pendingDetailsUser(userId): Observable<any> {
    const data = {}

    return this.http
      .get(
        this.servicesUrl + '/userManagement/pendingActions/details/' + userId,
        data,
      )
      .pipe(
        map((response: any) => {
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              response.errorCode,
              response.errorDescription,
            )
            return observableThrowError(errorService)
          } else {
            let resp: UserDetails
            resp = response
            resp.realGroup = {
              groupListOthers: [],
              groupListPayments: [],
              groupListTransfers: [],
              groupListBills: [],
              groupListCheckBook: [],
              groupListAramcoPayments: [],
              groupListBusinessCards: [],
              groupListPrePaidCards: [],
            }
            return resp
          }
        }),
        catchError(this.handleError),
      )
  }

  public resetPassword(_userId): Observable<any> {
    const data = {
      userId: _userId,
    }
    return this.http
      .put(this.servicesUrl + '/userManagement/resetPassword', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(errorService)
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public blockUser(_userId, mail): Observable<any> {
    const data = {
      sendMail: mail,
      userId: _userId,
    }
    return this.http
      .put(this.servicesUrl + '/userManagement/block/', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(errorService)
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  public unblockUser(userPk): Observable<any> {
    const data = {
      userId: userPk,
    }
    return this.http
      .put(this.servicesUrl + '/userManagement/unBlock/', data)
      .pipe(
        map((response: any) => {
          const body = response
          if (response.errorCode !== '0') {
            const errorService: Exception = new Exception(
              body.errorCode,
              body.errorDescription,
            )
            return observableThrowError(errorService)
          } else {
            return body
          }
        }),
        catchError(this.handleError),
      )
  }

  getList(criteria, pageNumber, rows4page, order, orderType): Observable<any> {
    const data = {
      department: criteria.department ? criteria.department : null,
      mobileNumber: criteria.mobileNumber ? criteria.mobileNumber : null,
      userId: criteria.userId ? criteria.userId : null,
      city: criteria.city ? criteria.city : null,
      region: criteria.region ? criteria.region : null,
      userType: criteria.userType ? criteria.userType : null,
      iqama: criteria.iqama ? criteria.iqama : null,
      nickname: criteria.nickname ? criteria.nickname : null,
      userName: criteria.userName ? criteria.userName : null,
      empRef: criteria.empRef ? criteria.empRef : null,
      status: criteria.status ? criteria.status : null,
      createdBy: criteria.createdBy ? criteria.createdBy : null,
      creationDateFrom: criteria.createdDateFromString
        ? criteria.createdDateFromString
        : null,
      creationDateTo: criteria.createdDateToString
        ? criteria.createdDateToString
        : null,
      orderType,
    }

    return this.http.post(this.servicesUrl + '/userManagement/list', data).pipe(
      map((response: any) => {
        const body = response
        //console.log( response + "response" );
        if (response.errorCode !== '0') {
          const errorService: Exception = new Exception(
            body.errorCode,
            body.errorDescription,
          )
          return observableThrowError(errorService)
        } else {
          const output = response
          const pagedData = new PagedData<CompanyUser>()
          const page = new Page()
          page.pageNumber = pageNumber
          page.pageSize = +rows4page
          page.totalElements = output.companyUserList.length
          page.totalPages = page.totalElements / page.pageSize
          page.size = output.size
          pagedData.data.push(...output.companyUserList.slice(page.pageNumber===1?0:page.pageSize*(page.pageNumber-1),page.pageSize*page.pageNumber))
          pagedData.page = page
          return pagedData
        }
      }),
      catchError(this.handleError),
    )
  }
}
