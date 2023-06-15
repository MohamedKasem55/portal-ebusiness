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

  @Input() form: FormGroup
  @Input() buttonLabel: string
  @Input() tableSelectedRows: any
  @Output() onNext = new EventEmitter<boolean>()
  @Output() onInit = new EventEmitter<Component>()

  isCollapsedContent = true
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

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  maxSelected = 20
  currencys: KeyValue<string, string>[] = []

  constructor(
    public service: BeneficiaryService,
    public fb: FormBuilder,
    public serviceTransfer: TransferInternationalService,
    public staticService: StaticService,
    public translate: TranslateService,
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

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
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
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  setPageSize(event) {
    this.beneficiaryPage.page.pageSize = event.target.value
    this.setPage(null)
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.loading = true

    this.beneficiaryPage.page.pageSize = 10
    this.subscriptions.push(
      this.service
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
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    this.loading = true

    this.beneficiaryPage.page.pageSize = 10
    this.subscriptions.push(
      this.service
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

  onSelect({ selected }) {
    const newSelected = this.removeDuplicate(selected)
    if (this.tableSelectedRows.length < this.maxSelected) {
      this.tableSelectedRows = []
      this.tableSelectedRows.splice(0, newSelected.length)
      this.tableSelectedRows.push(...newSelected)
    }
    return this.tableSelectedRows
  }

  getBeneficiaries() {
    this.setPage({ offset: 0 })
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  cancel() {
    this.onNext.emit(false)
  }

  submit() {
    this.subscriptions.push(
      this.service
        .fillBeneficiaries(this.tableSelectedRows)
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError(result)
            return
          } else {
            this.fillBeneficiariesData = result
            this.fillBeneficiariesData['remitterCategory'] =
              this.beneficiaryPage['remitterCategory']
            this.mensajeError = {}
            this.onNext.emit(true)
          }
        }),
    )
  }

  isValidData() {
    return (
      !this.mensajeError.hasOwnProperty('code') &&
      this.tableSelectedRows.length > 0
    )
  }

  ngOnInit() {
    super.ngOnInit()

    this.innerWidth = window.innerWidth
    this.setPage(null)
    this.mensajeError = {}
    this.subscriptions.push(
      this.serviceTransfer.transferInit().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.initTransferData = result
          this.mensajeError = {}
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
}
