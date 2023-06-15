import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'

import { Exception } from '../../../Model/exception'

import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { ManageUserService } from './manage-user.service'
import { UserShareService } from './user-share.service'
import { StaticService } from '../../Common/Services/static.service'

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss'],
})
export class ManageUserComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('userPageTable', { static: true }) table: any
  userPage: PagedData<any>

  private order: string
  private orderType: string

  tableSelectedRows: any = []

  isCollapsedContent = true

  userData: any

  searchForm: FormGroup
  searchFormData: any

  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    private service: ManageUserService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public userShareService: UserShareService,
  ) {
    super()
    this.searchForm = this.fb.group({
      userId: [''],
      userName: [''],
      mobile: [''],
    })
    this.searchFormData = Object.assign({}, this.searchForm.value)

    this.userPage = new PagedData<any>()
    this.userPage.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.userPage.page = page
    this.order = 'userId'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.setPage(null)
  }

  goAddUser() {
    this.router.navigate(['/companyadmin/pos/add-pos-user'])
  }

  goDeleteUser() {
    this.userShareService.setSelectedData(this.tableSelectedRows)
    this.router.navigate(['/companyadmin/pos/delete-pos-user'])
  }

  goModifyUser(user) {
    this.userShareService.setDataInit(user)
    this.router.navigate(['/companyadmin/pos/modify-pos-user'])
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.userPage.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.service
        .getUserList(
          this.searchFormData,
          this.userPage.page.pageNumber + 1,
          this.userPage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.userData = result
            this.userPage.page = result.page
            this.userPage.data = result.data
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.userPage.page.pageNumber = 1

    this.subscriptions.push(
      this.service
        .getUserList(
          this.searchFormData,
          this.userPage.page.pageNumber,
          this.userPage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.userData = result
            this.userPage.page = result.page
            this.userPage.data = result.data
          }
        }),
    )
  }

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    return this.tableSelectedRows
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.subscriptions.push(
      this.service
        .getUserList(
          this.searchFormData,
          1,
          this.userPage.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.userData = result
            this.userPage.page = result.page
            this.userPage.data = result.data
          }
        }),
    )
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {}
}
