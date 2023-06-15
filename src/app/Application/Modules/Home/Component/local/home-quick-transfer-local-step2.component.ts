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
import { Subscription } from 'rxjs'

import { TranslateService } from '@ngx-translate/core'
import { Beneficiary } from '../../../../../Application/Model/beneficiary'
import { FillBeneficiaries } from '../../../../../Application/Model/fillBeneficiaries'
import { Exception } from '../../../../Model/exception'
import { TransferLocalInit } from '../../Model/transferLocalInit'
import { BeneficiaryService } from '../../Services/beneficiary.service'
import { TransferLocalService } from '../../Services/transfer-local.service'
import { PagedData } from '../../../../../Application/Model/paged-data'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  selector: 'quick-local-transfer-step2',
  templateUrl: '../../View/local/home-quick-tranfer-local-step2.html',
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
export class QuickTransferStep2LocalWidget
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
  public innerWidth: any
  public mobile = false
  initTransferData: TransferLocalInit
  fillBeneficiariesData: FillBeneficiaries

  beneficiaryPage: PagedData<Beneficiary>
  formSearch: FormGroup
  beneficiaries: any[]
  order: string
  orderType: string

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  maxSelected = 20

  constructor(
    public service: BeneficiaryService,
    public fb: FormBuilder,
    public serviceTransfer: TransferLocalService,
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
      type: '02',
      pageSize: '',
    })
    this.formSearch.controls['filterBankCode'].disable()
    this.formSearch.controls['filterBankName'].disable()
    this.subscriptions.push(
      this.formSearch.controls['filterCriteria'].valueChanges.subscribe(
        (values) => {
          if (values == 'beneficiary') {
            this.formSearch.controls['filterBenefName'].enable()
            this.formSearch.controls['filterBankCode'].disable()
            this.formSearch.controls['filterBankName'].disable()
            this.formSearch.controls['filterBankCode'].reset()
            this.formSearch.controls['filterBankName'].reset()
            this.formSearch.controls['filterBankCode'].setValue('')
            this.formSearch.controls['filterBankName'].setValue('')
            this.formSearch.controls['filterBankCode'].updateValueAndValidity()
            this.formSearch.controls['filterBankName'].updateValueAndValidity()
          } else {
            this.formSearch.controls['filterBenefName'].disable()
            this.formSearch.controls['filterBenefName'].reset()
            this.formSearch.controls['filterBankCode'].enable()
            this.formSearch.controls['filterBankName'].enable()
          }
        },
      ),
    )
    this.beneficiaryPage = new PagedData<Beneficiary>()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  reset() {
    this.formSearch.reset()
    this.formSearch.controls['filterCriteria'].setValue('beneficiary')
    this.formSearch.controls['filterBankCode'].setValue('')
    this.formSearch.controls['filterBankName'].setValue('')
    this.formSearch.controls['filterBankCode'].updateValueAndValidity()
    this.formSearch.controls['filterBankName'].updateValueAndValidity()
    this.formSearch.controls['type'].setValue('02')
    this.formSearch.controls['filterBankCode'].disable()
    this.formSearch.controls['filterCriteria'].updateValueAndValidity()
    this.formSearch.controls['type'].updateValueAndValidity()
    this.formSearch.controls['filterBankCode'].updateValueAndValidity()
    this.getBeneficiaries()
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
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

    // Service Call
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
            //console.log(this.beneficiaryPage.data);
            //console.log(this.beneficiaryPage['remitterCategory']);
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    this.loading = true

    // Service Call with new short
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
            //console.log(this.beneficiaryPage.data);
            //console.log(this.beneficiaryPage['remitterCategory']);
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
            this.mensajeError = {}
            //console.log(this.fillBeneficiariesData);
            //console.log('emito submit');
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
    //console.log('emit init 2');
    this.innerWidth = window.innerWidth
    this.mensajeError = {}
    this.setPage(null)
    this.subscriptions.push(
      this.serviceTransfer.transferInit().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.initTransferData = result
          this.mensajeError = {}
          //console.log(this.initTransferData);
          this.onInit.emit(this as Component)
        }
      }),
    )
  }

  getId(row) {
    return (
      row['beneficiaryId'] +
      row['beneficiaryAccountCode'] +
      row['beneficiaryFullName'] +
      row['ernumber']
    )
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }
}
