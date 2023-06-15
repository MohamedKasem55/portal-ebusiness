import {
  AfterViewChecked,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Beneficiary } from '../../../../../Application/Model/beneficiary'
import { FillBeneficiaries } from '../../../../../Application/Model/fillBeneficiaries'
import { PagedData } from '../../../../../Application/Model/paged-data'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../../Model/exception'
import { TransferInternationalInit } from '../../Model/transferInternationalInit'
import { BeneficiaryService } from '../../Services/beneficiary.service'
import { TransferInternationalService } from '../../Services/transfer-international.service'
import { StaticService } from '../../../Common/Services/static.service'
import { KeyValue } from '@angular/common'
import { Router } from '@angular/router'
import { BeneficiariesInternationalBagService } from '../../../Beneficiaries/Services/beneficiaries-international-bag.service'

@Component({
  selector: 'quick-international-transfer-step2',
  templateUrl:
    '../../View/international/home-quick-tranfer-international-step2.html',
  styles: [
    `
      @media screen and (max-width: 800px) {
        .desktop-hidden {
          display: initial;
        }

        .mobile-hidden {
          display: none;
          width: 0%;
        }
      }

      @media screen and (min-width: 800px) {
        .desktop-hidden {
          display: none;
        }

        .mobile-hidden {
          display: initial;
        }
      }
    `,
  ],
})
export class QuickTransferStep2InternationalWidget
  extends DatatableMobileComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('beneficiaryTable', { static: true }) table: any
  @ViewChild('beneficiaryTableSelected', { static: true }) tableSelected: any
  @ViewChild('searchPanel', { static: true }) searchPanel: any
  tableDisplaySize = 10

  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() tableSelectedRows: any
  @Input() beneficiariesService: BeneficiaryService
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  loading = false

  initTransferData: TransferInternationalInit
  fillBeneficiariesData: FillBeneficiaries
  public innerWidth: any
  public mobile = false
  beneficiaryPage: PagedData<Beneficiary>
  formSearch: FormGroup
  beneficiaries: any[]
  order: string
  orderType: string

  errorMessage: any = {}
  subscriptions: Subscription[] = []

  maxSelected = 20
  currencys: KeyValue<string, string>[] = []
  selectAllOnPage: any = []

  constructor(
    public fb: FormBuilder,
    public serviceTransfer: TransferInternationalService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public beneficiariesInternationalBagService: BeneficiariesInternationalBagService,
  ) {
    super()
    this.formSearch = this.fb.group({
      erNumber: '',
      filterBankCode: '',
      filterBankName: '',
      filterBenefName: '',
      filterCriteria: 'beneficiary',
      filterCurrency: '',
      type: '03',
      pageSize: '',
    })
    this.beneficiaryPage = new PagedData<Beneficiary>()
    this.changeTypeCriteria('beneficiary')
    this.formSearch.controls.filterCriteria.valueChanges.subscribe((value) => {
      this.changeTypeCriteria(value)
    })
  }

  ngOnInit() {
    super.ngOnInit()

    if (this.searchPanel) {
      this.searchPanel.isCollapsedContent = true
    }

    this.innerWidth = window.innerWidth
    this.setPage(null)
    this.errorMessage = {}

    //console.log(this.service.selectedWithinBeneficiaries);
    if (
      this.beneficiariesService.selectedInternationalBeneficiaries &&
      this.beneficiariesService.selectedInternationalBeneficiaries.length == 0
    ) {
      this.tableSelectedRows = []
    } else {
      this.tableSelectedRows = this.beneficiariesService.selectedInternationalBeneficiaries
    }

    this.subscriptions.push(
      this.serviceTransfer.transferInit().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.initTransferData = result
          this.errorMessage = {}
          this.onInit.emit(this as Component)
        }
      }),
    )

    this.subscriptions.push(
      this.staticService
        .getAllCombos(['currency'])
        .subscribe((r: { values: any }) => {
          //console.log(r)
          this.currencys = r['0'].values

          const values = r['0'].values
          this.currencys = Object.keys(values).map((i) => {
            return { key: i, value: values[i] }
          })
          //console.log(this.currencys)
        }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    tablas.push(this.tableSelected)
    return tablas
  }

  reset() {
    this.formSearch = this.fb.group({
      erNumber: '',
      filterBankCode: '',
      filterBankName: '',
      filterBenefName: '',
      filterCriteria: 'beneficiary',
      filterCurrency: '',
      type: '03',
      pageSize: '',
    })
    this.tableSelectedRows = []
    this.getBeneficiaries()
  }

  changeTypeCriteria(value) {
    if (value == 'beneficiary') {
      this.formSearch.controls.filterBenefName.enable()
      this.formSearch.controls.filterBankName.reset()
      this.formSearch.controls.filterBankName.disable()
      this.formSearch.controls.filterCurrency.reset()
      this.formSearch.controls.filterCurrency.disable()
    } else if (value == 'bank') {
      this.formSearch.controls.filterBankName.enable()
      this.formSearch.controls.filterBenefName.reset()
      this.formSearch.controls.filterBenefName.disable()
      this.formSearch.controls.filterCurrency.reset()
      this.formSearch.controls.filterCurrency.disable()
    } else {
      this.formSearch.controls.filterCurrency.enable()
      this.formSearch.controls.filterBankName.reset()
      this.formSearch.controls.filterBankName.disable()
      this.formSearch.controls.filterBenefName.reset()
      this.formSearch.controls.filterBenefName.disable()
    }
  }

  onError(error: any) {
    const res = error
    this.errorMessage['code'] = res.error.errorCode
    this.errorMessage['description'] = res.error.errorDescription
  }

  setPageSize(event) {
    this.tableDisplaySize = event.target.value
    this.setPage(null)
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.loading = true

    this.beneficiaryPage.page.pageSize = this.tableDisplaySize
      ? this.tableDisplaySize
      : 10
    this.subscriptions.push(
      this.beneficiariesService
        .searchBeneficiaries(
          this.formSearch.value,
          dataTableEvent.offset + 1,
          this.beneficiaryPage.page.pageSize,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.loading = false
            this.beneficiaryPage = result
            setTimeout(() => {
              this.resizeAllTables()
            }, 200)
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    this.loading = true

    this.beneficiaryPage.page.pageSize = 10
    this.subscriptions.push(
      this.beneficiariesService
        .searchBeneficiaries(
          this.formSearch.value,
          dataTableEvent.offset + 1,
          this.beneficiaryPage.page.pageSize,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.beneficiaryPage = result
            this.loading = false
          }
        }),
    )
  }

  removeSelected(index) {
    this.tableSelectedRows.splice(index, 1)
  }

  removeDuplicate(selected) {
    const select = []
    const ids: Set<string> = new Set()
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < selected.length; i++) {
      const identificator =
        selected[i]['beneficiaryId'] +
        selected[i]['beneficiaryAccountCode'] +
        selected[i]['beneficiaryFullName'] +
        selected[i]['ernumber']

      if (ids.has(identificator)) {
        continue
      }
      select.push(selected[i])
      ids.add(identificator)
    }
    return select
  }

  // onSelect({selected}) {
  //     const newSelected = this.removeDuplicate(selected);
  //     if (this.tableSelectedRows.length < this.maxSelected) {
  //         this.tableSelectedRows = [];
  //         this.tableSelectedRows.splice(0, newSelected.length);
  //         this.tableSelectedRows.push(...newSelected);
  //     }
  //     return this.tableSelectedRows;
  // }
  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    //console.log('---select one---');
    //console.log(selected);
    this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = false

    // this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    // this.tableSelectedRows.push(...selected)

    this.tableSelectedRows.push(...selected)

    this.tableSelectedRows = this.tableSelectedRows.filter(
      (obj, index, self) =>
        index === self.findIndex((t) => this.getId(obj) === this.getId(t)),
    )
    this.tableSelectedRows = [
      ...this.tableSelectedRows.filter((row, index) => this.displayCheck(row)),
    ]

    this.beneficiariesService.selectedInternationalBeneficiaries = this.tableSelectedRows
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.beneficiaryPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.beneficiaryPage.data.map((beneficiary) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(beneficiary),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.beneficiaryPage.data)
      this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = true
      //console.log('-----------Select All----');
      //console.log(this.tableSelectedRows);
    } else {
      // Unselect all
      this.beneficiaryPage.data.map((beneficiary) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(beneficiary),
        )
      })
      this.selectAllOnPage[this.beneficiaryPage.page.pageNumber] = false
      //console.log('-----------UnSelect All');
      //console.log(this.tableSelectedRows)
    }

    this.beneficiariesService.selectedInternationalBeneficiaries = this.tableSelectedRows
  }

  removeFromSelected(row) {
    this.tableSelectedRows = this.tableSelectedRows.filter(
      (obj, index, self) => this.getId(obj) !== this.getId(row),
    )
    this.onSelect({
      selected: [],
    })
  }

  cleanSelected() {
    this.beneficiariesService.selectedLocalBeneficiaries = []
    this.tableSelectedRows = []
  }

  getBeneficiaries() {
    // this.cleanSelected()
    this.setPage({ offset: 0 })
  }

  cancel() {
    this.onNext.emit(false)
  }

  submit() {
    this.subscriptions.push(
      this.beneficiariesService
        .fillBeneficiaries(this.tableSelectedRows)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.fillBeneficiariesData = result
            this.fillBeneficiariesData['remitterCategory'] =
              this.beneficiaryPage['remitterCategory']
            this.errorMessage = {}
            this.onNext.emit(true)
          }
        }),
    )
  }

  isValidData() {
    return (
      !this.errorMessage.hasOwnProperty('code') &&
      this.tableSelectedRows.length > 0
    )
  }

  getId(row) {
    return (
      row['beneficiaryId'] + row['beneficiaryAccountCode'] + row['ernumber']
    )
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  displayCheck(row) {
    return row.beneficiaryCategory === 'C' || row.beneficiaryCategory === 'I'
  }

  updateCategory(row) {
    this.beneficiariesInternationalBagService.currentInternationalBeneficiary =
      this.beneficiariesInternationalBagService.transformInternationalBeneficiary(
        row,
      )
    this.router.navigate(['/beneficiaries/beneficiaryList/category_update'])
  }
}
