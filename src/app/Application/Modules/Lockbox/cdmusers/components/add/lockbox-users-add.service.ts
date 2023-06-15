import { HttpClient, HttpResponse } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { AbstractInitiatorService } from '../../../../Common/Services/Abstract/abstract-initiator-service'
import { StaticService } from '../../../../Common/Services/static.service'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'

@Injectable()
export class LockboxUsersAddService extends AbstractInitiatorService {
  currentUser: any = null
  initResponse: any = null
  currentUserSelected: any = null

  constructor(
    protected staticService: StaticService,
    protected router: Router,
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super(http, config)
  }

  servicesUrl: string

  back(route: string) {
    this.router.navigate([route])
  }

  search(
    searchElement: any,
    order: any,
    orderType: any,
    offset: any,
    pageSize: any,
  ): Observable<any> {
    const params = {
      userName:
        searchElement['userName'] != '' ? searchElement['userName'] : null,
      userId: searchElement['userId'] != '' ? searchElement['userId'] : null,
      // "cic": searchElement["cic"] != '' ? searchElement["cic"] : null,
      civilianId:
        searchElement['civilianId'] != '' ? searchElement['civilianId'] : null,
      dateCivilianExpiryCalendarFrom:
        searchElement['cIdExpirateDateFrom'] != ''
          ? new DateFormatPipe(this.injector, this._locale).transform(
              searchElement['cIdExpirateDateFrom'],
              'yyyy-MM-dd',
            )
          : null,
      dateCivilianExpiryCalendarTo:
        searchElement['cIdExpirateDateTo'] != ''
          ? new DateFormatPipe(this.injector, this._locale).transform(
              searchElement['cIdExpirateDateTo'],
              'yyyy-MM-dd',
            )
          : null,
      profileNumber: searchElement['cic'] != '' ? searchElement['cic'] : null,
      userStatus:
        searchElement['userStatus'] != '' ? searchElement['userStatus'] : null,
      terminalPK:
        searchElement['terminalPK'] != '' ? searchElement['terminalPK'] : null,
      rows: pageSize,
      page: offset,
      search: true,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/managementLockBox/users/list',
      params,
    )
  }

  protected createConfirmRequest(values: any): Observable<any> {
    return undefined
  }

  protected createInitRequest(): Observable<any> {
    return undefined
  }

  protected createValidateRequest(values: any): Observable<any> {
    return undefined
  }

  handleError(error: HttpResponse<any> | any): Observable<never> {
    return undefined
  }

  init(): Observable<any> {
    return undefined
  }

  initAdd(values): Observable<any> {
    const params = {
      civilianExpiryDate: this.getFormattedDateValue(
        values['civilianExpiryDate'],
      ),
      civilianId: values['civilianId'],
      dateOfBirth: this.getFormattedDateValue(values['dateOfBirth']),
    }
    return this.http
      .post(
        this.config.getServicesUrl() + '/lockbox/userManagement/add/init',
        params,
      )
      .pipe(
        map((result) => {
          if (result['user']) {
            if (result['user']['civExpirityDate']) {
              const civExpirityDate =
                result['user']['civExpirityDate'].split('-')
              result['user']['civExpirityDate'] = new Date(
                civExpirityDate[0],
                civExpirityDate[1] - 1,
                civExpirityDate[2],
                0,
                0,
                0,
              )
            }
            if (result['user']['civIssueDate']) {
              const civIssueDate = result['user']['civIssueDate'].split('-')
              result['user']['civIssueDate'] = new Date(
                civIssueDate[0],
                civIssueDate[1] - 1,
                civIssueDate[2],
                0,
                0,
                0,
              )
            }
            if (result['user']['dateOfBirth']) {
              const dateOfBirth = result['user']['dateOfBirth'].split('-')
              result['user']['dateOfBirth'] = new Date(
                dateOfBirth[0],
                dateOfBirth[1] - 1,
                dateOfBirth[2],
                0,
                0,
                0,
              )
            }
            // result['user']['civExpirityDate'] = this.getPropertyDateValue(
            //     result['user']['civExpirityDate']);
            // result['user']['civIssueDate'] = this.getPropertyDateValue(
            //     result['user']['civIssueDate']);
            // result['user']['dateOfBirth'] = this.getPropertyDateValue(
            //     result['user']['dateOfBirth']);
          }
          return result
        }),
      )
  }

  validate(values: any): Observable<any> {
    values['civExpirityDate'] = this.getFormattedDateValue(
      values['civExpirityDate'],
    )
    values['civIssueDate'] = this.getFormattedDateValue(values['civIssueDate'])
    values['dateOfBirth'] = this.getFormattedDateValue(values['dateOfBirth'])
    const params = {
      user: values,
    }
    return of({
      errorCode: '0',
      user: values,
    })

    /*
        return this.http
            .post(
                this.config.getServicesUrl() + '/lockbox/userManagement/add/validate',
                params,
            )
            .pipe(
                map((result) => {
                    if (result['user']) {
                        result['user']['civExpirityDate'] = this.getPropertyDateValue(
                            result['user']['civExpirityDate'],
                        )
                        result['user']['civIssueDate'] = this.getPropertyDateValue(
                            result['user']['civIssueDate'],
                        )
                        result['user']['dateOfBirth'] = this.getPropertyDateValue(
                            result['user']['dateOfBirth'],
                        )
                        return result
                    }
                }),
            )
         */
  }

  confirm(values: any): Observable<any> {
    values['civExpirityDate'] = this.getFormattedDateValue(
      values['civExpirityDate'],
    )
    values['civIssueDate'] = this.getFormattedDateValue(values['civIssueDate'])
    values['dateOfBirth'] = this.getFormattedDateValue(values['dateOfBirth'])
    const params = {
      user: values,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/lockbox/userManagement/add/confirm',
      params,
    )
  }

  getFormattedDateValue(dateValue) {
    return dateValue
      ? new DateFormatPipe(this.injector, this._locale).transform(
          dateValue,
          'yyyy-MM-dd',
        )
      : dateValue
  }

  getPropertyDateValue(dateValue) {
    return dateValue
      ? new Date(
          new DateFormatPipe(this.injector, this._locale).transform(
            dateValue,
            'yyyy-MM-dd',
          ),
        )
      : dateValue
  }
}
