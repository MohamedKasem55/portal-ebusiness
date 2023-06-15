import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { forkJoin, Observable, of, Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { PayrollCardsService } from '../../payroll-cards.service'
import { Page } from 'app/Application/Model/page'
import { map, switchMap } from 'rxjs/operators'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('authorization') authorization: any
  @ViewChild('tableOperations') tableOperations: any
  @ViewChild('tablePayments') tablePayments: any
  @ViewChild('tableUploadFiles') tableUploadFiles: any
  @ViewChild('uploadFilePageTable') uploadFilePageTable: any
  @ViewChild('tableNewCards') tableNewCards: any

  step = 2
  sharedData: any = {}

  operationsSubscription: Subscription
  tableOperationsLimit = 20

  paymentsSubscription: Subscription
  tablePaymentsLimit = 20

  uploadFilesSubscription: Subscription
  tableUploadFilesLimit = 20

  uploadFilesUserSubscription: Subscription
  tableUploadUserFilesLimit = 20

  newCardsSubscription: Subscription
  tableNewCardsLimit = 20

  rol: any

  constructor(
    private service: PayrollCardsService,
    public translate: TranslateService,
    private router: Router,
    public levelsPipe: LevelFormatPipe,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []

    if (this.tableOperations) {
      tablas.push(this.tableOperations)
    }
    if (this.tablePayments) {
      tablas.push(this.tablePayments)
    }
    if (this.tableUploadFiles) {
      tablas.push(this.tableUploadFiles)
    }
    if (this.uploadFilePageTable) {
      tablas.push(this.uploadFilePageTable)
    }
    if (this.tableNewCards) {
      tablas.push(this.tableNewCards)
    }
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.sharedData.responseValidate = {}
    this.sharedData.requestValidate = new RequestValidate()

    if (this.sharedData.operationsSelected.length !== 0) {
      this.operationsSubscription = this.service
        .operationsValidate(this.sharedData.operationsSelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result
            this.translateLevels()
          } else {
            this.router.navigate(['/myprofile/pending/payroll-cards/step1'])
          }
          this.operationsSubscription.unsubscribe()
        })
    }
    if (this.sharedData.paymentsSelected.length !== 0) {
      this.paymentsSubscription = this.service
        .paymentsValidate(this.sharedData.paymentsSelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result
            this.translateLevels()
          } else {
            this.router.navigate(['/myprofile/pending/payroll-cards/step1'])
          }
          this.paymentsSubscription.unsubscribe()
        })
    }
    if (this.sharedData.uploadFilesSelected.length !== 0) {
      //console.log("Validate files");
      this.uploadFilesSubscription = this.service
        .uploadFilesValidate(this.sharedData.uploadFilesSelected)
        .pipe(
          switchMap((result) => {
            const subsc: Observable<any>[] = []
            if (!result.error) {
              this.sharedData.responseValidate = result
              this.translateLevels()
              for (
                let i = 0;
                i < result['batchList']['toProcess'].length;
                i++
              ) {
                subsc.push(this.setPage('toProcess', i, null))
                // this.setPage("toProcess", i, null).subscribe();
              }
              for (
                let i = 0;
                i < result['batchList']['toAuthorize'].length;
                i++
              ) {
                subsc.push(this.setPage('toAuthorize', i, null))
                // this.setPage("toAuthorize", i, null);
              }
              return forkJoin(subsc)
              //console.log(this.sharedData);
            } else {
              return of[result]
            }
          }),
        )
        .subscribe((result) => {
          //console.log("result", result);
          if (result['error']) {
            this.router.navigate(['/myprofile/pending/payroll-cards/step1'])
          }
          this.uploadFilesSubscription.unsubscribe()
        })
    }
    if (this.sharedData.payrolCardsSelected.length !== 0) {
      this.newCardsSubscription = this.service
        .newCardValidate(this.sharedData.payrolCardsSelected)
        .subscribe((result) => {
          if (!result.error) {
            this.sharedData.responseValidate = result
            this.translateLevels()
          } else {
            this.router.navigate(['/myprofile/pending/payroll-cards/step1'])
          }
          this.newCardsSubscription.unsubscribe()
        })
    }
  }

  setPage(table, index, dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    if (!this.sharedData[table]) {
      this.sharedData[table] = {}
    }
    if (!this.sharedData[table]['userList']) {
      this.sharedData[table]['userList'] = {}
    }
    if (!this.sharedData[table]['userList'][index]) {
      this.sharedData[table]['userList'][index] = {}
    }

    if (!this.sharedData[table]['userList'][index]['page']) {
      const page = new Page();
      page.pageSize =  this.tableUploadUserFilesLimit;
      this.sharedData[table]['userList'][index]['page'] = page
    }
    
    this.sharedData[table]['userList'][index]['pageNumber'] =
      dataTableEvent.offset
    return this.service
      .uploadFilesUserGetList(
        this.sharedData.responseValidate['batchList'][table][index],
        this.sharedData[table]['userList'][index]['pageNumber'] + 1,
        this.tableUploadUserFilesLimit,
      )
      .pipe(
        map((result) => {
          if (!result.error) {
            this.sharedData[table]['userList'][index]['page'] = result.page
            this.sharedData[table]['userList'][index]['data'] = result.data
            this.sharedData[table]['userList'][index]['layout'] = result.layout
          }
        })
      )
  }

  
  paginate(table, index, dataTableEvent) {
   this.uploadFilesUserSubscription = this.setPage(table, index, dataTableEvent)
    .subscribe(() => {
      this.uploadFilesUserSubscription.unsubscribe()
    })
  }

  valid() {
    if (this.authorization == null) {
      return true
    } else {
      return !this.authorization || this.authorization.valid()
    }
  }

  openModal(row, popup) {
    popup.openModal(row)
  }

  private translateLevels(): void {
    if (this.sharedData && this.sharedData.operationsSelected) {
      let levels
      for (const item of this.sharedData.operationsSelected) {
        levels = item.futureSecurityLevelsDTOList
          ? item.futureSecurityLevelsDTOList
          : item.securityLevelsDTOList
        item.statusTrans = this.levelsPipe.transform(levels, 'status')
        item.nextStatusTrans = this.levelsPipe.transform(levels, 'nextStatus')
      }
    }
  }
}
