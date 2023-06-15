import {
  Attribute,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SearchablePanelComponent } from 'arb-design'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { StaticService } from '../../Services/static.service'
import { AbstractDatatableMobileComponent } from '../Abstract/abstract-datatable-mobile.component'
import { SearchCompanyUtilityService } from './search-company-utility.service'

enum SearchCompanySearchTypeEnum {
  GENERAL = 'GENERAL',
  REGISTERED = 'REGISTERED',
}

enum SearchCompanyOrganizationTypeEnum {
  Company = '0',
  Government = '1',
}

enum SearchCompanyPayrollTypeEnum {
  Payroll = 'P',
  WpsPayroll = 'W',
  BulkPayments = 'B',
  HajjUmrah = 'HU',
  VirtualAccounts = 'VA',
}

@Component({
  selector: 'app-search-company-utility',
  templateUrl: './search-company-utility.component.html',
  styleUrls: ['./search-company-utility.component.scss'],
})
export class SearchCompanyUtilityComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild(SearchablePanelComponent)
  searchablePanel: SearchablePanelComponent

  service: SearchCompanyUtilityService = null

  fieldsConfigForList: any[]

  fieldsConfigForSearchForm: any[]

  @Input() combosData: any = {}

  @Input() canAdd = false

  @Input() canExport = true

  @Input() addRoutes: any[]

  @Input() showSearchForm = true

  @Input() useBranches = true

  @Input() title = 'managementCompanyAdmin.companyList'

  @Input() overrideService: SearchCompanyUtilityService

  @Input() overrideSearchForm

  @Input() searchValues

  @Input() custom_fields_templates: any = {}

  @Output() onSelectCompany = new EventEmitter<any>()

  @Output() onSearchForm = new EventEmitter<any>()

  @Output() onResetForm = new EventEmitter<any>()

  constructor(
    public fb: FormBuilder,
    public defaultService: SearchCompanyUtilityService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    @Attribute('search-type')
    public searchType: SearchCompanySearchTypeEnum = SearchCompanySearchTypeEnum.GENERAL,
    @Attribute('organization-type')
    public organizationType: SearchCompanyOrganizationTypeEnum = null,
    @Attribute('payroll-type')
    public payrollType: SearchCompanyPayrollTypeEnum = null,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'companyProfile'
    this.orderType = 'asc'

    if (this.useBranches) {
      this.combosData['branches'] = this.combosData['branches']
        ? this.combosData['branches']
        : []
    }
    this.fieldsConfigForList = []
    this.fieldsConfigForSearchForm = []

    this.prepareAllServiceData()
  }

  ngOnInit() {
    this.prepareAllServiceData()
    super.ngOnInit()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  prepareAllServiceData() {
    this.searchForm = this.overrideSearchForm
      ? this.overrideSearchForm
      : this.fb.group({})

    if (this.overrideService != null) {
      this.service = this.overrideService
    } else {
      this.service = this.defaultService
    }

    this.service.setSearchType(this.searchType)
    this.service.setPayrollType(this.payrollType)

    this.fieldsConfigForList = this.service.getFieldsConfigForList()
    this.fieldsConfigForSearchForm = this.service.getFieldsConfigForSearchForm()
  }

  refreshData() {
    super.refreshData()
    if (this.useBranches) {
      this.combosData['branches'] = this.combosData['branches']
        ? this.combosData['branches']
        : []
      this.subscriptions.push(
        this.service.branches().subscribe((result) => {
          const branches = result.branchs
          const combosData = {}
          combosData['branches'] = []
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < branches.length; i++) {
            combosData['branches'].push({
              key: branches[i],
              value: this.getUnescapedStr(
                branches[i].branchRbs5 +
                  ' - ' +
                  (this.translate.currentLang == 'ar'
                    ? branches[i]['branchName']
                    : branches[i]['branchNameEn']),
              ),
            })
          }
          this.combosData = combosData
          this.service.comboDataList = this.combosData
          if (this.useBranches) {
            if (this.searchValues != null) {
              this.searchForm.patchValue(this.searchValues)
              this.searchForm.controls.branch.setValue(
                this.findBranch(
                  this.searchValues.branch,
                  combosData['branches'],
                ),
              )
            } else {
              this.searchForm.controls.branch.setValue(result.branchs[0])
            }
          }
          this.search()
        }),
      )
    } else {
      // this.combosData = {};
      this.service.comboDataList = this.combosData
      if (this.showSearchForm && this.searchValues != null) {
        this.searchForm.patchValue(this.searchValues)
      }
      this.search()
    }
  }

  findBranch(value, branches) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < branches.length; i++) {
      if (value != null) {
        if (branches[i].key.branchRbs5 == value.branchRbs5) {
          return branches[i].key
        }
      }
    }
    return null
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    if (this.useBranches) {
      let branchRbs5 = '00000'
      if (this.searchForm.get('branch').value !== null) {
        const branch = this.searchForm.get('branch').value
        branchRbs5 = branch ? branch['branchRbs5'] : null
      }
      searchElement.branch =
        branchRbs5 !== '' || branchRbs5 !== null || branchRbs5 !== undefined
          ? branchRbs5
          : '00000'
    }

    if (this.searchType == SearchCompanySearchTypeEnum.REGISTERED) {
      searchElement.registered =
        this.searchForm.get('registered').value == 'Y' ? 'Y' : 'N'
    } else {
      searchElement.registered = null
    }

    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = {
              page: {
                size: result.data['size'],
                totalElements: result.data['total'],
                totalPages: result.page.totalPages,
                pageNumber: result.page.pageNumber,
                pageSize: result.page.pageSize,
              },
              data: result.data['items'],
            }
          }
        }),
    )
  }

  onClickRow(selected, propName = null) {
    this.onSelectCompany.emit(selected)
  }

  isDisabled() {
    return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
  }

  getId(row) {
    return row['branchRbs5']
  }

  reset() {
    if (this.showSearchForm) {
      this.searchForm.reset()
    }
    this.search()
    if (this.showSearchForm) {
      this.onResetForm.emit(this.searchForm)
    }
  }

  search() {
    if (this.showSearchForm) {
      this.searchValues = this.searchForm.getRawValue()
    } else {
      this.searchValues = {}
    }
    super.search()
    if (this.showSearchForm) {
      this.onSearchForm.emit(this.searchForm)
    }
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
    this.elementsPage.page.pageNumber = dataTableEvent.offset
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.getList(
      this.searchFormData,
      this.order,
      this.orderType,
      dataTableEvent.offset + 1,
      this.elementsPage.page.pageSize,
    )
  }

  getExportColumns() {
    return this.service.getExportColumns()
  }

  getExportHeader() {
    return this.service.getExportHeader()
  }

  showExportButtons() {
    return this.canExport || this.service.showExportButtons()
  }

  canAddCompany() {
    return this.canAdd
  }

  isInitiator() {
    return this.authenticationService.activateOption(
      'ManagementBAMCompany',
      [],
      ['ManagementCompanyInitiator'],
    )
  }

  getUnescapedStr(str) {
    const txt = document.createElement('textarea')
    txt.innerHTML = unescape(str)
    return txt.value
  }
}
