import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { Page } from '../../../../../../Model/page'
import { PagedData } from '../../../../../../Model/paged-data'
import { DirectDebitsService } from '../../direct-debits.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('singleTable', { static: true }) singleTable: any
  @ViewChild('importTable', { static: true }) importTable: any

  currentItem: any = null
  step = 1
  sharedData: any = {}

  singlePagedResults: any = {}
  singleDisplaySize = 20
  singleSubscription: Subscription
  selectedSubscription: Subscription

  importPagedResults: any = {}
  importDisplaySize = 20
  importSubscription: Subscription
  futureLevels = false

  constructor(
    private service: DirectDebitsService,
    public translate: TranslateService,
    private levelsPipe: LevelFormatPipe,
  ) {
    super()
  }
  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.singleTable)
    tablas.push(this.importTable)
    return tablas
  }

  ngOnDestroy() {
    this.selectedSubscription.unsubscribe()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.singlePagedResults.items = []
    this.singlePagedResults.size = 0
    this.singlePagedResults.total = 0
    this.sharedData.singleSelected = []

    this.setPageSingle(null)

    this.importPagedResults.items = []
    this.importPagedResults.size = 0
    this.importPagedResults.total = 0
    this.sharedData.importSelected = []

    this.sharedData.selected = []

    this.setPageImport(null)

    this.selectedSubscription = this.service.getSingleSelected.subscribe(
      (selected) => {
        this.sharedData.singleSelected = selected
        this.sharedData.importSelected = []
      },
    )
  }

  setPageSingle(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.singleSubscription = this.service
      .getListSingle(pageInfo.offset + 1, this.singleDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.singlePagedResults = result.pendingDirectDebitsList
          this.translateLevels()
        }
        this.singleSubscription.unsubscribe()
      })
  }

  // onSelectSingle({ selected }) {
  //   //console.log(this.singelTable);
  //   this.sharedData.importSelected = [];
  //   this.sharedData.singleSelected.splice(
  //       0,
  //       this.sharedData.singleSelected.length
  //   );
  //   this.sharedData.singleSelected.push(...selected);
  // }

  setPageImport(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.importSubscription = this.service
      .getListImport(pageInfo.offset + 1, this.importDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.importPagedResults = result.pendingDirectDebitsList
          this.translateLevels()
        }
        this.importSubscription.unsubscribe()
      })
  }

  onSelectImport({ selected }) {
    this.sharedData.singleSelected = []
    this.sharedData.importSelected.splice(
      0,
      this.sharedData.importSelected.length,
    )
    this.sharedData.importSelected.push(...selected)
    // this.sharedData.selected = this.sharedData.importSelected;
  }

  valid() {
    return true
  }

  onClickDirectDebitItem(row) {
    this.service.getDirectDebitPADetail(row).subscribe((result) => {
      if (result.error == true) {
      } else {
        // console.log(result);
        if (typeof result.batchList[0] != 'undefined') {
          const directDebit = result.batchList[0]
          const currentItem = []
          currentItem['originatorId'] = directDebit.originatorId
          currentItem['batchName'] = directDebit.batchName
          currentItem['claimDate'] = directDebit.claimDate
          currentItem['initiationDate'] = directDebit.initiationDate
          currentItem['originatorName'] =
            result.directDebitFeesOutput.originatorName
          currentItem['status'] = directDebit.status

          const authorizationPage = new PagedData<any>()
          authorizationPage.data = []
          const page2 = new Page()
          page2.pageNumber = 1
          page2.pageSize = 20
          authorizationPage.page = page2

          authorizationPage.data = directDebit.securityLevelsDTOList
          authorizationPage.page.totalPages = 1
          authorizationPage.page.totalElements = authorizationPage.data.length
          authorizationPage.page.size = authorizationPage.data.length
          currentItem['authorizationPage'] = authorizationPage

          const recordPage = new PagedData<any>()
          recordPage.data = []
          const page = new Page()
          page.pageNumber = 1
          page.pageSize = 20
          recordPage.page = page

          recordPage.data = directDebit.details
          recordPage.page.totalPages = 1
          recordPage.page.totalElements = recordPage.data.length
          currentItem['recordsData'] = recordPage

          currentItem['directDebitFeesOutput'] = result.directDebitFeesOutput

          currentItem['directDebit'] = true
          this.currentItem = currentItem
          this.service.setCurrentItem(currentItem)
          this.sharedData.singleSelected = []
          this.sharedData.singleSelected.push(row)
        }
      }
    })
  }

  onClickDirectDebitUploadFileItem(row) {
    this.service.getDirectDebitUploadFileDetail(row).subscribe((result) => {
      if (result.error == true) {
      } else {
        const directDebit = result.directDebit
        const currentItem = []
        currentItem['originatorId'] = directDebit.originatorId
        currentItem['dueDate'] = directDebit.claimDate
        currentItem['initiationDate'] = directDebit.initiationDate
        currentItem['systemFileName'] = directDebit.systemFileName
        currentItem['userFileName'] = directDebit.userFileName
        currentItem['status'] = directDebit.status

        const authorizationPage = new PagedData<any>()
        authorizationPage.data = []
        const page2 = new Page()
        page2.pageNumber = 1
        page2.pageSize = 20
        authorizationPage.page = page2

        authorizationPage.data = directDebit.futureSecurityLevelsDTOList
        authorizationPage.page.totalPages = 1
        authorizationPage.page.totalElements = authorizationPage.data.length
        authorizationPage.page.size = authorizationPage.data.length
        currentItem['authorizationPage'] = authorizationPage

        const recordPage = new PagedData<any>()
        recordPage.data = []
        const page = new Page()
        page.pageNumber = 1
        page.pageSize = 20
        recordPage.page = page

        recordPage.data = directDebit.directDebitFileInfoDTO.details
        recordPage.page.totalPages = 1
        recordPage.page.totalElements = recordPage.data.length
        currentItem['recordsData'] = recordPage

        currentItem['directDebitFeesOutput'] = result.directDebitFeesOutput

        currentItem['directDebit'] = false

        this.currentItem = currentItem
        this.service.setCurrentItem(currentItem)
        this.sharedData.importSelected = []
        this.sharedData.importSelected.push(row)
      }
    })
  }

  openModal(
    row: { futureSecurityLevelsDTOList: any; securityLevelsDTOList: any },
    popup: { openModal: { (arg0: any): void; (arg0: any): void } },
  ) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }

  private translateLevels(): void {
    if (this.singlePagedResults && this.singlePagedResults.items) {
      let levels
      for (const item of this.singlePagedResults.items) {
        levels = item.futureSecurityLevelsDTOList
          ? item.futureSecurityLevelsDTOList
          : item.securityLevelsDTOList
        item.statusTrans = this.levelsPipe.transform(levels, 'status')
        item.nextStatusTrans = this.levelsPipe.transform(levels, 'nextStatus')
      }
    }

    if (this.importPagedResults && this.importPagedResults.items) {
      let levels
      for (const item of this.importPagedResults.items) {
        levels = item.futureSecurityLevelsDTOList
          ? item.futureSecurityLevelsDTOList
          : item.securityLevelsDTOList
        item.statusTrans = this.levelsPipe.transform(levels, 'status')
        item.nextStatusTrans = this.levelsPipe.transform(levels, 'nextStatus')
      }
    }
  }

  changeDisplay(event) {
    this.singleDisplaySize = event
    this.setPageSingle(null)
  }
}
