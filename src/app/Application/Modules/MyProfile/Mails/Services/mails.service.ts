import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { concat, Observable } from 'rxjs'
import { catchError, filter, map } from 'rxjs/operators'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AppService } from '../../../../../core/service/app.service'
import { StorageService } from '../../../../../core/storage/storage.service'
import { MailResponse } from '../../../../Components/dashboard-layout/dashboard-service'
import {
  Mail,
  MailBuilder,
} from '../../../../Components/dashboard-layout/mail-model'
import { AppResponse } from '../../../../Model/app.response'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'

@Injectable()
export class MailsService extends AppService {
  serviceUrl: string

  constructor(
    private http: HttpClient,
    config: ConfigResourceService,
    private storageService: StorageService,
  ) {
    super()
    this.serviceUrl = config.getServicesUrl().concat('/mailCenter/')
  }

  public getSelectedMail(): Mail {
    let selectedMail: Mail = null
    const jsonMail = this.storageService.retrieve('selectedMail')
    if (jsonMail) {
      selectedMail = JSON.parse(jsonMail)
    }
    return selectedMail
  }

  public observeSelectedMail(): Observable<Mail> {
    const observableOfSelectedMail: Observable<Mail> = new Observable<Mail>(
      (observer) => {
        observer.next(this.getSelectedMail())
        observer.complete()
        return {
          unsubscribe() {},
        }
      },
    )
    return concat(
      observableOfSelectedMail,
      this.storageService.observe('selectedMail').pipe(
        map((value: string) => {
          try {
            return JSON.parse(value)
          } catch (e) {
            return null
          }
        }),
        filter((mail) => mail !== null),
      ),
    )
  }

  public pushMailToStore(mail: Mail) {
    this.storageService.store('selectedMail', JSON.stringify(mail))
  }

  public pushMailFolderToStore(folder: any) {
    this.storageService.store('mailFolder', folder)
  }

  public getMailFolder() {
    let mailFolder: any = 'I'
    const folder = this.storageService.retrieve('mailFolder')
    if (folder) {
      mailFolder = folder
    }
    return mailFolder
  }

  public getMailsTable(
    folder: string,
    order: string,
    orderType: string,
    offset: number,
    rows: number,
  ): Observable<PagedData<Mail>> {
    const data = {
      folder,
      order,
      orderType,
      page: offset + 1,
      rows,
      displayLoading: true,
    }
    return this.http
      .post<MailResponse>(this.serviceUrl + 'getMails', data)
      .pipe(
        map((response: MailResponse) => {
          const resultData = new PagedData<Mail>()
          if (response.errorCode !== '-1') {
            const output = response.mailBoxDTO
            const pageObject: Page = new Page()
            pageObject.pageNumber = offset
            pageObject.pageSize = rows
            pageObject.size = output.size
            pageObject.totalElements = output.total
            pageObject.totalPages =
              pageObject.totalElements / pageObject.pageSize

            // tslint:disable-next-line:prefer-for-of
            for (let _i = 0; _i < output.mailList.length; _i++) {
              const jsonObj = output.mailList[_i]
              const mail: Mail = new MailBuilder()
                .withMailId(jsonObj.mailPk)
                .withSubject(jsonObj.subject)
                .withContent(jsonObj.content)
                .withFrom(jsonObj.from)
                .withFromName(jsonObj.fromName)
                .withTo(jsonObj.to)
                .withToName(jsonObj.toName)
                .withStatus(jsonObj.status)
                .withDate(jsonObj.date)
                .build()
              resultData.data.push(mail)
            }
            resultData.page = pageObject
          }
          return resultData
        }),
        catchError(this.handleError),
      )
  }

  public sendMail(mail: Mail): Observable<AppResponse> {
    const data = {
      content: mail.content,
      subject: mail.subject,
      toAddress: mail.to,
      toName: mail.toName,
      displayLoading: true,
    }
    return this.http
      .post<AppResponse>(this.serviceUrl + 'sendMail', data)
      .pipe(catchError(this.handleError))
  }

  public deleteMails(mails: Mail[], folder: any): Observable<any> {
    const data = {
      mailsToDelete: mails,
      folder: folder,
    }
    return this.http
      .post<AppResponse>(this.serviceUrl + 'deleteMails', data)
      .pipe(catchError(this.handleError))
  }

  public markMailAsRead(mail: Mail): Observable<any> {
    const data = {
      mailsToMark: Array.of(mail),
    }
    return this.http
      .post<AppResponse>(this.serviceUrl + 'markReaded', data)
      .pipe(catchError(this.handleError))
  }

  public listCCDTO(): Observable<MailCCDTO[]> {
    return this.http.get<ResponseMailCC>(this.serviceUrl + 'newMessage').pipe(
      map((response: ResponseMailCC) => {
        let ccList: MailCCDTO[] = []
        if (response.errorCode != '-1') {
          ccList = response.mailCCDTO
        }
        return ccList
      }),
      catchError(this.handleError),
    )
  }
}

export class ResponseMailCC extends AppResponse {
  mailCCDTO: MailCCDTO[] = []
}

export class MailCCDTO {
  mailAddress: string
  userId: string
  userName: string

  constructor(mailAddress: string, userId: string, userName: string) {
    this.mailAddress = mailAddress
    this.userId = userId
    this.userName = userName
  }
}
