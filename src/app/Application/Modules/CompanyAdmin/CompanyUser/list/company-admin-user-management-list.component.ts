import { DatePipe } from '@angular/common'
import {
  Component,
  Injector,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ModelPipe } from 'app/Application/Components/common/Pipes/model-pipe'
import { PagedData } from 'app/Application/Model/paged-data'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { StorageService } from 'app/core/storage/storage.service'
import { Subscription } from 'rxjs'
import { StaticService } from '../../../Common/Services/static.service'
import { CompanyUser } from '../../Model/company-user'
import { CompanyAdminUserManagementListService } from './company-admin-user-management-list.service'
import { CompanyAdminUserManagementSelectedDataService } from './company-admin-user-management-selected-data.service'

@Component({
  templateUrl: './company-admin-user-management-list.component.html',
  styleUrls: ['./company-admin-user-management-list.component.scss'],
})
// Component class implementing OnInit
export class CompanyAdminUserManagementListComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy {
  @ViewChild('companyUserPageTable', { static: true }) table: any
  @ViewChild('searchPanel', { static: true }) searchPanel: any
  // Private properties for binding
  searchForm: FormGroup
  dualAuthorization = false

  companyUserPage: PagedData<CompanyUser>
  order: string
  orderType: string

  combosData: any = {}

  subscriptions: Subscription[] = []
  public isCollapsedASearchContent = true
  bsConfig = Object.assign(
    {},
    {
      showWeekNumbers: false,
      adaptivePosition: true,
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD/MM/YYYY',
    },
  )

  vaPermissions = {
    vaPermissions: [
      { key: 'CORPORATE', value: 'Corporate Processor' },
      {
        key: 'CORPVER',
        value: 'Corporate Verifier',
      },
      { key: 'ESCROWVER', value: 'Escrow Corporate Verifier' },
      {
        key: 'ESCROWPRO',
        value: 'Escrow Corporate Processor',
      },
      { key: 'VAESCGRP', value: 'VA Escrow Processor' },
      {
        key: 'VAESCVERGR',
        value: 'VA ESCROW VERIFIER',
      },
    ],
  }

  constructor(
    public route: ActivatedRoute,
    public _companyAdminManageUserService: CompanyAdminUserManagementListService,
    public selectedDataService: CompanyAdminUserManagementSelectedDataService,
    public router: Router,
    public translate: TranslateService,
    public staticService: StaticService,
    public datePipe: DatePipe,
    private _sanitizer: DomSanitizer,
    public fb: FormBuilder,
    public injector: Injector,
    public storage: StorageService,
  ) {
    super()
    this.order = 'userId'
    this.orderType = 'asc'
    this.companyUserPage = new PagedData<CompanyUser>()
    this.dualAuthorization = JSON.parse(storage.retrieve('currentUser'))[
      'company'
    ]['dualAuthorization'];
  }

  getAllTables(): any[] {
    return [this.table]
  }

  ngOnInit() {
    super.ngOnInit()
    let modelSearch = this.storage.retrieve('userListSearchModel')
    modelSearch = modelSearch ? JSON.parse(modelSearch) : {}

    let createdDateFrom = null
    let createdDateTo = null
    if (
      modelSearch &&
      typeof modelSearch.createdDateFrom != 'undefined' &&
      modelSearch.createdDateFrom != null &&
      modelSearch.createdDateFrom.length > 0
    ) {
      createdDateFrom = new Date(modelSearch.createdDateFrom)
    }
    if (
      modelSearch &&
      typeof modelSearch.createdDateTo != 'undefined' &&
      modelSearch.createdDateTo != null &&
      modelSearch.createdDateTo.length > 0
    ) {
      createdDateTo = new Date(modelSearch.createdDateTo)
    }

    this.searchForm = this.fb.group({
      userId: [modelSearch ? modelSearch.userId : '', []],
      userName: [modelSearch ? modelSearch.userName : '', []],
      mobileNumber: [modelSearch ? modelSearch.mobileNumber : '', []],
      department: [modelSearch ? modelSearch.department : '', []],
      city: [modelSearch ? modelSearch.city : '', []],
      region: [modelSearch ? modelSearch.region : '', []],
      userType: [modelSearch ? modelSearch.userType : '', []],
      iqama: [modelSearch ? modelSearch.iqama : '', []],
      nickname: [modelSearch ? modelSearch.nickname : '', []],
      empRef: [modelSearch ? modelSearch.empRef : '', []],
      status: [modelSearch ? modelSearch.status : '', []],
      createdBy: [modelSearch ? modelSearch.createdBy : '', []],
      createdDateFrom: [createdDateFrom != null ? createdDateFrom : '', []],
      createdDateTo: [createdDateTo != null ? createdDateTo : '', []],
    })

    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )
    this.refreshData()
  }

  refreshData(): void {
    const combosKeys = ['userType', 'userStatus', 'lockBoxFeesStatus', 'process']
    if (this.searchPanel) {
      this.searchPanel.isCollapsedContent = true
    }
    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(combosKeys)
        .subscribe((resultC) => {
          if (resultC === null) {
            this.onError(resultC)
          } else {
            const data: any = resultC
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < combosKeys.length; i++) {
              this.combosData[combosKeys[i]] = data[combosKeys[i]]
                ? data[combosKeys[i]]
                : []
            }
          }
          this.setPage(null)
        }),
    )
    //this.setPage(null);
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    // if (this.searchPanel) {
    //   this.searchPanel.isCollapsedContent = false;
    // }

    this.guessSearchBeCollapsed()
    this.guessAdvancedSearchBeCollapse()

    this.companyUserPage.page.pageNumber = dataTableEvent.offset

    const modelSearch = Object.assign({}, this.searchForm.value)

    modelSearch.createdDateFromString = modelSearch.createdDateFrom
      ? this.datePipe.transform(modelSearch.createdDateFrom, 'yyyy-MM-dd')
      : ''
    modelSearch.createdDateToString = modelSearch.createdDateTo
      ? this.datePipe.transform(modelSearch.createdDateTo, 'yyyy-MM-dd')
      : this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    this._companyAdminManageUserService
      .getList(
        modelSearch,
        this.companyUserPage.page.pageNumber + 1,
        this.companyUserPage.page.pageSize,
        this.order,
        this.orderType,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          result.data.forEach((user) => {
            if (user.userImage) {
              user.userImage = this._sanitizer.bypassSecurityTrustResourceUrl(
                user.userImage,
              )
            }
            user.userTypeExport = new ModelPipe(this.injector).transform(
              'userType',
              user.type,
            )
            user.userActionExport = this.getExportAction(user);
            user.userStatusExport = new ModelPipe(this.injector).transform(
              'userStatus',
              user.userStatus
            )
          })
          this.companyUserPage = result
          this.storage.store('userListSearchModel', JSON.stringify(modelSearch))
        }
      })
  }

  getExportAction(user: any): string {
    let actionExport = '';
    let processStatus = '';
    let process = '';
    const processStatusList = this.combosData['lockBoxFeesStatus']
      ? this.combosData['lockBoxFeesStatus']
      : []
    let elemProcessStatus = null
    elemProcessStatus = processStatusList.find((item) => item.key == user.processStatus)
    if (elemProcessStatus != null) {
      processStatus = elemProcessStatus.value;
    }

    const processList = this.combosData['process']
      ? this.combosData['process']
      : []
    let elemProcess = null
    elemProcess = processList.find((item) => item.key == user.process)
    if (elemProcess != null) {
      process = elemProcess.value;
    }
    actionExport = processStatus + ' / ' + process;
    return actionExport;
  }

  setSort(dataTableEvent) {
    //console.log(dataTableEvent);
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.companyUserPage.page.pageNumber = 0

    this.search()
  }

  details(userId) {
    const modelSearch = Object.assign({}, this.searchForm.value)
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.companyUserPage.data.length; i++) {
      if (this.companyUserPage.data[i].userId === userId) {
        this.selectedDataService.setSelectedUser(this.companyUserPage.data[i])
        this.router.navigate(['/companyadmin/user/details'])
      }
    }
  }

  onError(result) {
    //
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  /*If there is some filter applied, not collapse*/

  guessSearchBeCollapsed() {
    if (this.searchPanel) {
      const formData = this.searchForm.getRawValue()
      this.searchPanel.isCollapsedContent = true

      Object.keys(formData).forEach((key) => {
        if (formData[key] != null && formData[key] != '') {
          this.searchPanel.isCollapsedContent = false
        }
      })
    }
  }

  guessAdvancedSearchBeCollapse() {
    this.isCollapsedASearchContent = true
    if (
      this.searchForm.controls.nickname.value != null &&
      this.searchForm.controls.nickname.value != ''
    ) {
      this.isCollapsedASearchContent = false
    }
    if (
      this.searchForm.controls.empRef.value != null &&
      this.searchForm.controls.empRef.value != ''
    ) {
      this.isCollapsedASearchContent = false
    }
    if (
      this.searchForm.controls.status.value != null &&
      this.searchForm.controls.status.value != ''
    ) {
      this.isCollapsedASearchContent = false
    }
    if (
      this.searchForm.controls.createdBy.value != null &&
      this.searchForm.controls.createdBy.value != ''
    ) {
      this.isCollapsedASearchContent = false
    }
    if (
      this.searchForm.controls.createdDateFrom.value != null &&
      this.searchForm.controls.createdDateFrom.value != ''
    ) {
      this.isCollapsedASearchContent = false
    }
    if (
      this.searchForm.controls.createdDateTo.value != null &&
      this.searchForm.controls.createdDateTo.value != ''
    ) {
      this.isCollapsedASearchContent = false
    }
  }

  search() {
    if (this.isCollapsedASearchContent) {
      this.searchForm.controls.nickname.setValue('')
      this.searchForm.controls.empRef.setValue('')
      this.searchForm.controls.status.setValue('')
      this.searchForm.controls.createdBy.setValue('')
      this.searchForm.controls.createdDateFrom.setValue('')
      this.searchForm.controls.createdDateTo.setValue('')
    }
    this.setPage({ offset: 0 })
  }

  getMaxDateToday(date) {
    return date ? date : new Date()
  }

  getMinDate(date) {
    return date ? date : false
  }

  reset() {
    this.selectedDataService.clear()
    this.searchForm.controls.userId.setValue('')
    this.searchForm.controls.userName.setValue('')
    this.searchForm.controls.mobileNumber.setValue('')
    this.searchForm.controls.department.setValue('')
    this.searchForm.controls.city.setValue('')
    this.searchForm.controls.region.setValue('')
    this.searchForm.controls.userType.setValue('')
    this.searchForm.controls.iqama.setValue('')
    this.searchForm.controls.nickname.setValue('')
    this.searchForm.controls.empRef.setValue('')
    this.searchForm.controls.userStatus.setValue('')
    this.searchForm.controls.createdBy.setValue('')
    this.searchForm.controls.createdDateFrom.setValue('')
    this.searchForm.controls.createdDateTo.setValue('')
    this.search()
  }

  allowDetails(user) {
    return (user.processStatus === 'P' && user.process === 'RG') ? false : true
  }

  public getTableCurrentPageSize(table) {
    if (table && table.bodyComponent && table.bodyComponent.temp) {
      return table.bodyComponent.temp.length
    }
    return 0
  }
}
