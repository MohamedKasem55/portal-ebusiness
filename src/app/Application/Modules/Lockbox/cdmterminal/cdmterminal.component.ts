import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../core/storage/storage.service'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'
import { CdmterminalService } from './cdmterminal.service'

@Component({
  selector: 'app-cdmterminal',
  templateUrl: './cdmterminal.component.html',
  styleUrls: ['./cdmterminal.component.scss'],
})
export class CdmterminalComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any

  filter: FormGroup
  listFilesPage: PagedData<any>
  combosSolicitados: string[] = ['hajjCardsStatusFilter']
  bsConfig: any
  isSearchCollapsed = true
  isCollapsed = true
  cardNumber
  visa
  status
  tableSelected = []
  selected
  show = 'list'
  searchCategory
  searchlistPage
  searchList
  allStatus = []
  posTable: any

  fileDetails
  serialLists
  viewProcessedFilesPage: PagedData<any>
  request
  detailList
  requestData = []
  institution
  statementValue
  lokbxterminalId
  terminalSubscription: Subscription

  constructor(
    public translate: TranslateService,
    private formBuilder: FormBuilder,
    public cdmterminalservice: CdmterminalService,
    public staticService: StaticService,
    public storageService: StorageService,
    public router: Router,
  ) {
    super()
    this.searchlistPage = new PagedData<any>()
    this.searchlistPage.data = []
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 10
    this.searchlistPage.page = page
  }

  ngOnInit() {
    super.ngOnInit()
    this.getlistofData()

    this.searchlistPage.size = 0
    this.searchlistPage.total = 0
    this.selected = []

    this.show = 'list'
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.isSearchCollapsed = true
    this.isCollapsed = true
  }

  clearValue() {
    this.requestData = []
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    return tablas
  }

  lkbxterminalchange(changevalue) {
    this.lokbxterminalId = changevalue
  }

  goActivate(row) {
    //console.log(row);
  }
  onSelect({ selected }) {
    //console.log('Select Event', selected, this.tableSelectedRows);
    this.selected.splice(0, this.selected.length)
    this.selected.push(...selected)
  }

  details(detailId) {
    this.terminalSubscription = this.cdmterminalservice
      .getlistId(detailId)
      .subscribe((result) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          return
        } else {
          this.cdmterminalservice.setTerminalDetails(result.terminal)
        }
        this.terminalSubscription.unsubscribe()
        this.router.navigate(['/lockbox/CDMterminal/terminaldetails'])
      })
  }

  getlistofData() {
    this.cdmterminalservice.getlist().subscribe(
      (data) => {
        this.serialLists = data.terminalList
        this.searchlistPage.data = []
        this.searchlistPage.data = data.terminalList
        this.searchlistPage.page.size = this.searchlistPage.page.pageSize
        this.searchlistPage.page.totalElements = data.terminalList.length
      },
      (err) => {
        //console.log(err);
      },
    )
  }

  multipleflies($event) {
    //console.log(this.selected);
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.request.rows = this.searchlistPage.page.pageSize
    this.request.page = dataTableEvent.offset + 1
    this.cdmterminalservice.listStatementData(this.request).subscribe(
      (data) => {
        this.searchList = data
      },
      (err) => {
        //console.log(err);
      },
    )
  }
}
