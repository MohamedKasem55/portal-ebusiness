import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SearchablePanelComponent } from 'arb-design'
import { BaseChartDirective } from 'ng2-charts'
import { distinctUntilChanged, switchMap } from 'rxjs/operators'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { PagedData } from '../../../../Model/paged-data'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { DynamicSimpleExtrasFormFieldsComponent } from '../../../Common/Components/DynamicFormFields/dynamic-simple-extras-form-fields.component'
import { StaticService } from '../../../Common/Services/static.service'
import { LockboxCashOutListService } from '../cashOut/lockbox-cashOut-list.service'
import { LockboxTransactionsListService } from '../transactions/lockbox-transactions-list.service'
import { LockboxReportsListService } from './lockbox-reports-list.service'

@Component({
  selector: 'app-lockbox-reports-list',
  templateUrl: './lockbox-reports-list.component.html',
  styleUrls: ['./lockbox-reports-list.component.scss'],
})
export class LockboxReportsListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  reloaded = false
  public isCollapsedASearchContent = false
  public disabledSearch = false
  dynamicFormComponent: DynamicSimpleExtrasFormFieldsComponent

  @ViewChild(SearchablePanelComponent) searchablePanel: SearchablePanelComponent
  @ViewChild('elementsTable', { static: true }) elementsTable: any
  @ViewChild(BaseChartDirective) chartWidget: BaseChartDirective

  combosKeys: any[] = ['lockBoxTerminalReportStatus'] // ask for key lockBoxTerminalReportStatus
  combosData: any = {}

  fieldsConfigForList: any[]

  fieldsConfigForSearchForm: any[]

  routes: any[] = [['dashboard.lockbox'], ['lockbox.cdmReports.menu']]

  //----------------------------------------------------------//
  //----------BEGIN TESTING CHART PROTOTYPE--------------------//
  public chartType = 'doughnut'

  public chartDatasets: any[] = [] //[ { data: [300, 50, 100, 40, 120], label: 'My First dataset' } ];

  public chartLabels: any[] = [] // = ['Red', 'Green', 'Yellow', 'Grey', 'Dark Grey'];

  public chartColors: any[] = [
    {
      // backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      // hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
      backgroundColor: ['#11b10c', '#FDB45C', '#F7464A'],
      hoverBackgroundColor: ['#2fb159', '#FFC870', '#FF5A5E'],
      borderWidth: 2,
    },
  ]

  public chartOptions: any = {
    responsive: true,
  }

  public chartClicked(e: any): void {}

  public chartHovered(e: any): void {}

  //-------END TESTING CHART PROTOTYPE---------------------------------------------------//

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public listService: LockboxReportsListService,
    public transactionListService: LockboxTransactionsListService,
    public cashOutListService: LockboxCashOutListService,
  ) {
    super(fb, translate, authenticationService, router)

    // this.order = "serialNumber";
    // this.orderType = "asc";

    this.combosData = {}
    this.combosData['terminals'] = []
    this.combosData['regions'] = []
    this.combosData['cities'] = []

    this.fieldsConfigForList = []
    this.fieldsConfigForSearchForm = []
    this.searchForm = this.fb.group({})

    this.listService.chartData = {
      totalUp: 0,
      totalWarning: 0,
      totalError: 0,
      upPercentage: 0.0,
      warningPercentage: 0.0,
      errorPercentage: 0.0,
    }
  }

  ngOnInit() {
    super.ngOnInit()
    const previousUrl = this.listService.getPreviousUrl()
    if (
      previousUrl != '/lockbox/cdm-reports/cashOut' &&
      previousUrl != '/lockbox/cdm-reports/transactions'
    ) {
      this.listService.lastSearchFormData = null
    }

    this.loadComboData()
  }

  refreshData() {
    this.loadComboData()
    if (
      this.searchForm &&
      this.searchForm.get('regionPK') &&
      this.searchForm.get('regionPK').value != null &&
      this.searchForm.get('regionPK').value != ''
    ) {
      this.updateCities(this.searchForm.get('regionPK').value)
    }
  }

  loadComboData() {
    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeys)
        .pipe(
          switchMap((resultC) => {
            const data: object = resultC
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.combosKeys.length; i++) {
              this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
            }
            // -------------------------------------------------
            return this.listService.getTerminals()
          }),
          switchMap((terminalResponse) => {
            this.initTerminalCombo(terminalResponse)
            return this.listService.getRegions()
          }),
        )
        .subscribe((response) => {
          if (response.errorCode == 0) {
            let regions = []
            const regionsList = []
            regions =
              typeof response.regionList != 'undefined'
                ? response.regionList
                : []
            regions.forEach((region) => {
              regionsList.push({
                key: region.regionPK,
                value: region.name,
              })
            })
            this.dynamicFormComponent.changeComboDataAssignedToField(
              'regionPk',
              'regions',
              regionsList,
            )
          }

          // TODO check if init endpoint will have all date needed to filter (city,region, terminal)
          // -------------------------------------------------
          // this.listService.getInitValues({}).subscribe((result) => {
          //   if (result && result.errorCode != "0") {
          //
          //   } else {
          //     // -------------------------------------------------
          //     if (result && result.terminals) {
          //       result.terminals.forEach((item) => {
          //         this.combosData['accounts'].push({
          //           key: item,
          //           value: item.terminalIDName
          //         });
          //       })
          //     }
          //     if (result && result.users) {
          //       result.users.forEach((item) => {
          //         this.combosData['users'].push({
          //           key: item,
          //           value: item.userIdName
          //         });
          //       })
          //     }
          //     // -------------------------------------------------
          //     this.fieldsConfigForList = this.listService.getFieldsConfigForList()
          //     this.fieldsConfigForSearchForm = this.listService.getFieldsConfigForSearchForm()
          //     this.listService.setCombosData(this.combosData)
          //     //this.search(false)
          //   }
          // })
          // -------------------------------------------------

          this.fieldsConfigForList = this.listService.getFieldsConfigForList()
          this.fieldsConfigForSearchForm =
            this.listService.getFieldsConfigForSearchForm()
          if (this.listService.lastSearchFormData) {
            this.reloadLastReportCriteria()
            this.reloaded = true
          }
          this.listService.setCombosData(this.combosData)
        }),
    )
  }

  initTerminalCombo(response) {
    if (response.errorCode == 0) {
      let terminals = []
      const terminalsList = []
      if (response.errorCode == 0) {
        terminals =
          typeof response.terminalList != 'undefined'
            ? response.terminalList
            : []

        terminals.forEach((terminal) => {
          terminalsList.push({
            key: terminal.terminalID,
            value: terminal.terminalID + '-' + terminal.terminalName,
          })
        })
        this.dynamicFormComponent.changeComboDataAssignedToField(
          'terminalID',
          'terminals',
          terminalsList,
        )
      }
    }
    this.disabledSearch = false
  }
  getList(searchElement, order, orderType, offset, pageSize) {
    this.resetData()
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

            //TODO remove, moke data for develop
            // this.listService.chartData = {
            //     totalUp: 100,
            //     totalWarning : 200,
            //     totalError :  300,
            //     upPercentage :  20.00,
            //     warningPercentage :  30.00,
            //     errorPercentage :  40.00,
            // };
            // "Up (${navigation.upPercentage}%)",

            const charData = this.listService.chartData
            this.chartDatasets = []
            this.chartLabels = []
            this.chartDatasets.push(charData.totalUp)
            this.chartDatasets.push(charData.totalWarning)
            this.chartDatasets.push(charData.totalError)
            charData['errorPercentage'] =
              100 -
              ((charData.upPercentage ? +charData.upPercentage : 0.0) +
                (+charData.warningPercentage
                  ? +charData.warningPercentage
                  : 0.0))

            this.chartLabels.push(
              this.translate.instant('lockbox.cdmReports.up') +
                ' (' +
                charData.upPercentage +
                ')%',
            )
            this.chartLabels.push(
              this.translate.instant('lockbox.cdmReports.warning') +
                ' ' +
                charData.warningPercentage +
                ')%',
            )
            this.chartLabels.push(
              this.translate.instant('lockbox.cdmReports.error') +
                ' ' +
                charData.errorPercentage +
                ')%',
            )
            this.forceChartRefresh()
          }
        }),
    )
  }

  forceChartRefresh() {
    //this.elementsTable.recalculate();
    setTimeout(() => {
      this.chartWidget.update()
      //this.chartOptions.legend = {};
      //this.chartWidget.ngOnChanges();
      //this.chartWidget.generateLegend();
    }, 10)
  }

  isDisabled() {
    return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getIdFieldName() {
    return 'terminalID'
  }

  getId(row) {
    return row[this.getIdFieldName()]
  }

  resetData() {
    this.elementsPage = new PagedData<any>()
    this.chartDatasets = []
    this.chartLabels = []
  }

  reset() {
    this.resetData()
    this.searchForm.reset() //controls.status.reset();
    this.listService.lastSearchFormData = null
  }

  search(isSearching = true) {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched()
      return
    }

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
    this.listService.lastSearchFormData = Object.assign({}, this.searchFormData)
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
    // this.detailsService.setSelectedItem(row);
    //this.router.navigate(['/lockbox/reports/details'])
  }

  isInitiator() {
    return this.authenticationService.activateOption(
      'ManagementLockBox',
      [],
      ['ManagementLockBoxInitiator'],
    )
  }

  canExecuteAction(action) {
    switch (action) {
      case 'detailsTransactions':
        return this.authenticationService.activateOption(
          'ManagementLockBox',
          [],
          ['ManagementLockBoxInitiator', 'ManagementLockBoxValidator'],
        )
        break
      case 'detailsCashOut':
        return this.authenticationService.activateOption(
          'ManagementLockBox',
          [],
          ['ManagementLockBoxInitiator', 'ManagementLockBoxValidator'],
        )
        break
      default:
        break
    }
    return false
  }

  onInitForm($event) {
    this.dynamicFormComponent = $event
  }

  onAllFielsCreated($event) {
    const formModel = $event.form
    //this.onProfileNumberChange(formModel)
    this.onRegionChange(formModel)
    if (this.listService.lastSearchFormData && this.reloaded) {
      this.search()
      this.reloaded = false
    }
  }

  onRegionChange(form) {
    if (
      form.get('regionPK') != null &&
      typeof form.get('regionPK') != 'undefined' &&
      form.get('regionPK') != ''
    ) {
      this.subscriptions.push(
        form
          .get('regionPK')
          .valueChanges.pipe(distinctUntilChanged())
          .subscribe((value: any) => {
            if (value != null && value != '') {
              this.updateCities(value)
            }
          }),
      )
    }
  }

  updateCities(value) {
    this.listService.getCities(value).subscribe((response) => {
      if (response.errorCode == 0) {
        let cities = []
        const citiesList = []
        if (response.errorCode == 0) {
          cities =
            typeof response.cityList != 'undefined' ? response.cityList : []

          cities.forEach((city) => {
            citiesList.push({
              key: city.cityPK,
              value: city.name,
            })
          })
          this.dynamicFormComponent.changeComboDataAssignedToField(
            'cityPK',
            'cities',
            citiesList,
          )
        }
      }
    })
  }
  goTransactions($event, row) {
    this.subscriptions.push(
      this.listService.getReportDetail(row).subscribe((response) => {
        if (response.errorCode == 0) {
          this.transactionListService.setSelectedTerminal(
            response.lockBoxTerminal,
          )
          this.router.navigate(['/lockbox/cdm-reports/transactions'])
        }
      }),
    )
  }

  goCashOut($event, row) {
    this.subscriptions.push(
      this.listService.getReportDetail(row).subscribe((response) => {
        if (response.errorCode == 0) {
          this.cashOutListService.setSelectedTerminal(response.lockBoxTerminal)
          this.router.navigate(['/lockbox/cdm-reports/cashOut'])
        }
      }),
    )
  }

  pad(n, width, z) {
    z = z || '0'
    n = n + ''
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
  }

  reloadLastReportCriteria() {
    this.fieldsConfigForSearchForm.forEach((element) => {
      if (this.listService.lastSearchFormData[element['key']]) {
        element['default'] = this.listService.lastSearchFormData[element['key']]
      }
    })
  }
}
