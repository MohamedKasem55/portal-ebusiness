import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { PagedData } from '../../../../../Model/paged-data'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../static.service'
import { CardOperationsEntityService } from '../../card-opeartions-entity.service'
import { CardOpeartionsService } from '../../card-opeartions.service'

@Component({
  selector: 'app-cardOperations-table',
  templateUrl: './card-operations-table.component.html',
  styleUrls: ['../../card-operations.component.scss'],
})
export class CardOperationsTableComponent
  extends AbstractDatatableMobileComponent
  implements OnInit
{
  @ViewChild('table') table: any

  combosSolicitados: string[] = ['hajjCardsStatusFilter']
  hajjCardsOptions = []
  sharedData = []
  searchCategory
  allStatus = []
  hajjCardsOperations = []
  operation
  searchForm: FormGroup
  @Input() fixedInfo: boolean
  @Input() step: any
  isSearchCollapsed: boolean
  futureLevels: boolean
  selectAllOnPage: any = []

  constructor(
    public translate: TranslateService,
    public cardOpeartionsService: CardOpeartionsService,
    public staticService: StaticService,
    public fb: FormBuilder,
    public storageService: StorageService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private serviceData: CardOperationsEntityService,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'cardNumber'
    this.orderType = 'desc'
    this.futureLevels = true

    this.searchForm = this.fb.group({
      cardNumber: [],
      visa: [],
      status: [],
    })
  }

  ngOnInit(): void {
    this.isSearchCollapsed = true
    super.ngOnInit()
    this.onCriteriaChange('')
    this.listOfStatus()
    this.onCriteriaChange('')
    this.search()

    //console.log(this.service.selectedWithinBeneficiaries);
    if (
      this.serviceData.tableSelectedRows &&
      this.serviceData.tableSelectedRows.length == 0
    ) {
      this.tableSelectedRows = []
    } else {
      this.tableSelectedRows = this.serviceData.tableSelectedRows
      this.serviceData.setSelectedData(this.tableSelectedRows)
    }
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    searchElement.searchCategory = this.searchCategory
    if (!this.fixedInfo) {
      this.subscriptions.push(
        this.cardOpeartionsService
          .getResults(searchElement, order, orderType, offset, pageSize)
          .subscribe((result) => {
            if (result === null) {
              this.onError(result)
            } else {
              this.elementsPage = result
            }
          }),
      )
    } else {
      var elements = new PagedData<any>()
      var operationsData =
        this.serviceData.getSelectedData().batchDTO.toAuthorize
      if (!operationsData.length) {
        var data = []
        data.push(operationsData)

        operationsData = data
        this.serviceData.clear()
        this.serviceData.setSelectedData(operationsData)
      }
      elements.data = operationsData
      elements.page.pageNumber = operationsData.length
      elements.page.size = operationsData.length
      elements.page.pageSize = operationsData.length
      elements.page.totalElements = operationsData.length
      elements.page.totalPages = 20

      this.elementsPage = elements
    }
  }

  displayCheck(row) {
    return true
  }

  reset() {
    this.cleanSelected()
    this.searchCategory = null
    super.reset()
  }

  onCriteriaChange(target) {
    let value = ''
    if (target && target.value) {
      value = target.value
    }
    if (value === 'cardNumber') {
      this.searchForm.controls.visa.reset()
      this.searchForm.controls.visa.disable()
      this.searchForm.controls.status.reset()
      this.searchForm.controls.status.disable()
      this.searchForm.controls.cardNumber.enable()

      this.searchCategory = 'cardReferenceNumber'
    } else if (value === 'visa') {
      this.searchForm.controls.cardNumber.reset()
      this.searchForm.controls.cardNumber.disable()
      this.searchForm.controls.status.reset()
      this.searchForm.controls.status.disable()
      this.searchForm.controls.visa.enable()

      this.searchCategory = 'nationalId'
    } else if (value === 'status') {
      this.searchForm.controls.cardNumber.reset()
      this.searchForm.controls.cardNumber.disable()
      this.searchForm.controls.visa.reset()
      this.searchForm.controls.visa.disable()
      this.searchForm.controls.status.enable()

      this.searchCategory = 'status'
    } else {
      this.searchForm.controls.cardNumber.reset()
      this.searchForm.controls.cardNumber.disable()
      this.searchForm.controls.visa.reset()
      this.searchForm.controls.visa.disable()
      this.searchForm.controls.status.reset()
      this.searchForm.controls.status.disable()
    }
  }

  getId(row) {
    return (
      row['cardNumber'] +
      row['cardHolderName'] +
      row['visaNumber'] +
      row['passportNumber'] +
      row['status'] +
      row['cardExpiryDate']
    )
  }

  // onSelect({ selected }) {
  // 	this.tableSelectedRows = [];
  // 	this.tableSelectedRows.splice(0, selected.length);
  // 	this.tableSelectedRows.push(...selected);
  // 	this.serviceData.setSelectedData(this.tableSelectedRows);
  // 	return this.tableSelectedRows;
  // }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    //console.log('---select one---');
    //
    this.selectAllOnPage[this.elementsPage.page.pageNumber] = false

    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    this.serviceData.setSelectedData(this.tableSelectedRows)
    this.serviceData.tableSelectedRows = JSON.parse(
      JSON.stringify(this.tableSelectedRows),
    )
    return this.tableSelectedRows
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.elementsPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.elementsPage.data.map((bill) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.elementsPage.data)
      this.selectAllOnPage[this.elementsPage.page.pageNumber] = true
      //console.log('-----------Select All----');
      //
    } else {
      // Unselect all
      this.elementsPage.data.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.elementsPage.page.pageNumber] = false
      //console.log('-----------UnSelect All');
      //console.log(this.tableSelectedRows)
    }
    //console.log('Select Event', selected, this.tableSelected);
    this.serviceData.setSelectedData(this.tableSelectedRows)
    this.serviceData.tableSelectedRows = JSON.parse(
      JSON.stringify(this.tableSelectedRows),
    )
  }

  cleanSelected() {
    this.serviceData.tableSelectedRows = []
    this.tableSelectedRows = []
  }

  search(cleanSelected = false) {
    if (cleanSelected == true) {
      this.cleanSelected()
    }
    this.setPage({ offset: 0, rows: 20 })
  }

  listOfStatus() {
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .subscribe((result) => {
        const data = result
        const valores =
          data[this.combosSolicitados.indexOf('hajjCardsStatusFilter')][
            'values'
          ]
        Object.keys(valores).map((key, index) => {
          this.allStatus.push({ key, value: valores[key] })
        })
      })
  }

  refreshData() {
    const combosSolicitados = ['hajjCardsOptions']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData

        this.hajjCardsOptions = []
        const index = Object.keys(
          data[combosSolicitados.indexOf('hajjCardsOptions')]['values'],
        ).sort((a, b) => {
          return data[combosSolicitados.indexOf('hajjCardsOptions')]['values'][
            a
          ] > data[combosSolicitados.indexOf('hajjCardsOptions')]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf('hajjCardsOptions')]['values'][b] >
              data[combosSolicitados.indexOf('hajjCardsOptions')]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index.length; i++) {
          this.hajjCardsOptions.push({
            key: index[i],
            value:
              data[combosSolicitados.indexOf('hajjCardsOptions')]['values'][
                index[i]
              ],
          })
        }
      })
  }

  convert(str) {
    if (str) {
      const date = new Date(str),
        mnth = ('0' + (date.getMonth() + 1)).slice(-2),
        day = ('0' + date.getDate()).slice(-2)
      return [date.getFullYear(), mnth, day].join('-')
    } else {
      return ''
    }
  }

  selectOPeration(value) {
    this.operation = value
  }

  // ngOnDestroy() {
  // 	super.ngOnDestroy()
  // }

  openModal(row, popup) {
    if (this.futureLevels) {
      popup.openModal(row.futureSecurityLevelsDTOList)
    } else {
      popup.openModal(row.securityLevelsDTOList)
    }
  }
}
