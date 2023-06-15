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
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { LockboxUsersListService } from './lockbox-users-list.service'
import { LockboxUsersDetailsService } from '../details/lockbox-users-details.service'

@Component({
  selector: 'app-lockbox-users-list',
  templateUrl: './lockbox-users-list.component.html',
  styleUrls: ['./lockbox-users-list.component.scss'],
})
export class LockboxUsersListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild(SearchablePanelComponent)
  searchablePanel: SearchablePanelComponent

  combosKeys: any[] = [
    'lockBoxUserRole',
    'lockBoxUserStatus',
    // 'process',
    // 'processStatus',
    // 'lockBoxMachineStatusSearch',
  ]
  combosData: any = {}

  fieldsConfigForList: any[]

  fieldsConfigForSearchForm: any[]

  routes: any[] = [['dashboard.lockbox'], ['lockbox.cdmUsers.menu']]

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public listService: LockboxUsersListService,
    public detailsService: LockboxUsersDetailsService,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'serialNumber'
    this.orderType = 'asc'

    this.combosData = {}
    this.combosData['civilianIdList'] = []
    this.combosData['listLbTerminalList'] = []

    this.fieldsConfigForList = []
    this.fieldsConfigForSearchForm = []
    this.searchForm = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()
  }

  refreshData() {
    super.refreshData()

    this.combosData['civilianIdList'] = []
    this.combosData['listLbTerminalList'] = []

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeys)
        .subscribe((resultC) => {
          const data: any = resultC
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.combosKeys.length; i++) {
            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
          }
          // -------------------------------------------------
          this.listService.getInitValues({}).subscribe((result) => {
            if (result && result.errorCode != '0') {
            } else {
              this.combosData['civilianIdList'] = []
              this.combosData['listLbTerminalList'] = []
              result.listCivilian.forEach((item) => {
                if (item.civilianId != '') {
                  this.combosData['civilianIdList'].push({
                    key: item,
                    value: item.civilianId,
                  })
                }
              })
              result.listLbTerminal.forEach((item) => {
                if (item.terminalID != '') {
                  this.combosData['listLbTerminalList'].push({
                    key: item,
                    value: item.terminalIDName,
                  })
                }
              })
              this.listService.setCombosData(this.combosData)
              // -------------------------------------------------
              this.fieldsConfigForList =
                this.listService.getFieldsConfigForList()
              this.fieldsConfigForSearchForm =
                this.listService.getFieldsConfigForSearchForm()
              this.search(true)
            }
          })
          // -------------------------------------------------
        }),
    )
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.listService
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
            this.combosData = Object.assign({}, this.combosData)
            this.listService.setCombosData(this.combosData)
          }
        }),
    )
  }

  isDisabled() {
    return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getIdFieldName() {
    return 'userId'
  }

  getId(row) {
    return row[this.getIdFieldName()]
  }

  reset() {
    this.searchForm.reset() //controls.status.reset();
    this.search()
  }

  search(isSearching = true) {
    if (this.searchForm && this.searchForm.get('search')) {
      this.searchForm.get('search').setValue(isSearching)
    }
    super.search()
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
    return this.listService.getExportColumns()
  }

  getExportHeader() {
    return this.listService.getExportHeader()
  }

  showExportButtons() {
    return this.listService.showExportButtons()
  }

  onClickRow(row: any, propName = null) {
    this.detailsService.setSelectedItem(row)
    this.router.navigate(['/lockbox/cdm-users/details'])
  }

  canExecuteAction(action) {
    switch (action) {
      case 'details':
        return this.authenticationService.activateOption(
          'LockBoxUsers',
          ['LOCKBOX_PRIVILEGE'],
          ['LockboxGroupAdmin'],
        )
      default:
        break
    }
    return false
  }

  onSearchFormAllFieldsCreated($event) {
    if (this.searchForm.get('radiobutton')) {
      this.searchForm.get('userPk').setValue(null)
      this.searchForm.get('terminalPk').setValue(null)
      this.searchForm.get('userPk').disable()
      this.searchForm.get('terminalPk').disable()
      this.searchForm.get('userPk').updateValueAndValidity()
      this.searchForm.get('terminalPk').updateValueAndValidity()

      this.searchForm.get('radiobutton').valueChanges.subscribe((value) => {
        if (this.searchForm.get('radiobutton').value == '1') {
          this.searchForm.get('userPk').setValue(null)
          this.searchForm.get('terminalPk').setValue(null)
          this.searchForm.get('userPk').enable()
          this.searchForm.get('terminalPk').disable()
        } else if (this.searchForm.get('radiobutton').value == '2') {
          this.searchForm.get('userPk').setValue(null)
          this.searchForm.get('terminalPk').setValue(null)
          this.searchForm.get('userPk').disable()
          this.searchForm.get('terminalPk').enable()
        } else {
          this.searchForm.get('userPk').setValue(null)
          this.searchForm.get('terminalPk').setValue(null)
          this.searchForm.get('userPk').disable()
          this.searchForm.get('terminalPk').disable()
        }
        this.searchForm.get('userPk').updateValueAndValidity()
        this.searchForm.get('terminalPk').updateValueAndValidity()
      })
    }
  }
}
