// Imports
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { take } from 'rxjs/operators'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Mail } from '../../../../Components/dashboard-layout/mail-model'
import { PagedData } from '../../../../Model/paged-data'
import { MailsService } from '../Services/mails.service'

@Component({
  templateUrl: '../View/list-mails.component.html',
  styleUrls: ['../View/list-mails.component.scss'],
})
export class ListMailsComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('mailTable') table: DatatableComponent
  mailPage: PagedData<Mail>
  tableSelectedRows = []
  MailFolder = MailFolder
  order: string
  orderType: string
  mailFolder: string
  loading: boolean
  folderTitle: string

  confirmDelete: boolean

  constructor(
    private mailsService: MailsService,
    public translate: TranslateService,
    private router: Router,
  ) {
    super()
    this.setDefaultTableData()
    this.mailFolder = MailFolder.INBOX
    this.setMailFolder(MailFolder.INBOX)
    this.folderTitle = 'myProfile.mails.folder.ninbox'
  }

  getAllTables(): any[] {
    return Array.of(this.table)
  }

  onSelect({ selected }) {
    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.loading = true
    // Service Call
    this.mailsService
      .getMailsTable(
        this.mailFolder,
        this.order,
        this.orderType,
        dataTableEvent.offset,
        this.mailPage.page.pageSize,
      )
      .pipe(take(1))
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.mailPage = result
        }
      })
  }

  setSort(dataTableEvent) {
    if (dataTableEvent == null || !dataTableEvent.offest) {
      dataTableEvent = { offset: 0 }
    }
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }
    this.setPage(dataTableEvent)
  }

  setMailFolder(folder: any): void {
    this.mailsService.pushMailFolderToStore(folder)
  }

  onError(result) {
    this.loading = false
  }

  // Load data ones component is ready
  ngOnInit() {
    super.ngOnInit()
    this.setPage({ offset: 0 })
  }

  ngOnDestroy() {}

  getId(row) {
    return row['mailPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  navigateToMailDetail(mail: Mail) {
    this.mailsService.pushMailToStore(mail)
    this.router.navigate(['/myprofile/mails/detail'])
  }

  submitFolder(selectedFolder, force = false) {
    if (selectedFolder && (selectedFolder != this.mailFolder || force)) {
      this.setDefaultTableData()
      this.cleanTableSelection()
      switch (selectedFolder) {
        case MailFolder.INBOX:
          this.folderTitle = 'myProfile.mails.folder.ninbox'
          break
        case MailFolder.OUTBOX:
          this.folderTitle = 'myProfile.mails.folder.nsend'
          break
        case MailFolder.TRASH:
          this.folderTitle = 'myProfile.mails.folder.ntrash'
          break
      }
      //Load data for a different folder
      this.mailFolder = selectedFolder
      this.setMailFolder(selectedFolder)
      this.setPage({ offset: 0 })
    }
  }

  deleteSelectedMails() {
    this.confirmDelete = true
  }

  setDefaultTableData() {
    this.confirmDelete = false
    this.mailPage = new PagedData<Mail>()
    this.order = 'date'
    this.orderType = 'desc'
  }

  cleanTableSelection() {
    //Clean table selection
    //this.table.selected = [];
    this.tableSelectedRows = []
  }
}

export enum MailFolder {
  INBOX = 'I',
  OUTBOX = 'O',
  TRASH = 'T',
}
