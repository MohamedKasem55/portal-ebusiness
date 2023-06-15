import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SearchablePanelComponent } from 'arb-design'
import { first } from 'rxjs/operators'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { HijraDateFormatPipe } from '../../../../Components/common/Pipes/hijra-date-format-pipe'
import { PagedData } from '../../../../Model/paged-data'
import { AbstractDatatableMobileComponent } from '../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../Common/Services/static.service'
import {
  searchFormDateFromValidators,
  searchFormDateToValidators,
} from './processed-transactions.component.searchformdates.validator'
import { ProcessedTransactionsService } from './processed-transactions.service'

@Component({
  templateUrl: './processed-transactions.component.html',
  selector: 'processed-transactions',
})
export class ProcessedTransactionsComponent
  extends AbstractDatatableMobileComponent
  implements OnInit
{
  searchForm: FormGroup
  bsConfig: any
  errorTableNull = 'E000'
  requestedSelectors = [
    'bankCode',
    'countryName',
    'currency',
    'transferPaymentType',
    'transferStatus',
  ]
  countryNameSelect: any[]
  currency: any[]
  debitAccountSelect: any[]
  statusSelect: any[]
  processedTransactions: any[]
  beneficiaryBankCode = []
  lastApprovalDateFrom = null
  lastApprovalDateTo = null
  minimaTo: any
  dateTo = null
  dateFrom = null
  today: Date = new Date()
  usersSelect: any[]

  @ViewChild('searchablePanelComponent', { static: true })
  panel: SearchablePanelComponent

  constructor(
    public staticService: StaticService,
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    public service: ProcessedTransactionsService,
    private injector: Injector,
  ) {
    super(fb, translate, authenticationService, router)
    this.searchForm = fb.group({
      paymentType: [''],
      debitAccount: [''],
      countryName: [''],
      beneficiaryBankCode: [''],
      currency: [''],
      amountFrom: ['', [Validators.minLength(0), Validators.maxLength(10)]],
      amountTo: ['', [Validators.minLength(0), Validators.maxLength(10)]],
      lastApprovalDateFrom: ['', [searchFormDateFromValidators]],
      jirahLastApprovalDateFrom: [''],
      lastApprovalDateTo: ['', [searchFormDateToValidators]],
      jirahLastApprovalDateTo: [''],
      initiatedBy: [''],
      approvedBy: [''],
      status: [''],
    })
  }

  ngOnInit(): void {
    this.panel.isCollapsedContent = true
    this.elementsPage = new PagedData<any>()
    super.ngOnInit()
    const hijra = new HijraDateFormatPipe(this.injector)
    this.subscriptions.push(
      this.searchForm.controls['lastApprovalDateFrom'].valueChanges.subscribe(
        (values) => {
          this.searchForm.controls['jirahLastApprovalDateFrom'].setValue(
            hijra.transform(values, 'dd/MM/yyyy'),
          )
        },
      ),
    )
    this.subscriptions.push(
      this.searchForm.controls['lastApprovalDateTo'].valueChanges.subscribe(
        (values) => {
          this.searchForm.controls['jirahLastApprovalDateTo'].setValue(
            hijra.transform(values, 'dd/MM/yyyy'),
          )
        },
      ),
    )
    this.populateRequestedSelectors()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.getList({}, null, null, 1, 50)
  }

  //Search action triggered by Searchable Panel
  public search() {
    this.getList(Object.assign({}, this.searchForm.value), null, null, 1, 50)
  }

  public amountRangeValidation(_formData: FormGroup): boolean {
    if (
      _formData.controls['amountTo'].value ||
      _formData.controls['amountFrom'].value
    ) {
      if (
        _formData.controls['amountTo'].touched &&
        _formData.controls['amountFrom'].touched
      ) {
        if (+_formData.value.amountTo > +_formData.value.amountFrom) {
          return true
        } else if (+_formData.value.amountTo === +_formData.value.amountFrom) {
          return false
        } else {
          return false
        }
      }
      return true
    }
    return true
  }

  //Sets Form Values to null
  public reset() {
    this.searchForm.reset()
    this.search()
    this.searchForm = this.fb.group({
      paymentType: [''],
      debitAccount: [''],
      countryName: [''],
      beneficiaryBankCode: [''],
      currency: [''],
      amountFrom: [''],
      amountTo: [
        '',
        [
          Validators.required,
          Validators.minLength(0),
          Validators.maxLength(10),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      lastApprovalDateFrom: [''],
      jirahLastApprovalDateFrom: [''],
      lastApprovalDateTo: [''],
      jirahLastApprovalDateTo: [''],
      initiatedBy: [''],
      approvedBy: [''],
      status: [''],
    })
    this.beneficiaryBankCode = []
  }

  refreshData() {
    super.refreshData()
    this.populateRequestedSelectors()
  }
  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }
  getList(
    searchElement: any,
    order: any,
    orderType: any,
    offset: any,
    pageSize: any,
  ) {
    searchElement['page'] = offset
    searchElement['rows'] = pageSize
    this.checkEmptyParamValues(searchElement, 'paymentType')
    this.checkEmptyParamValues(searchElement, 'debitAccount')
    this.checkEmptyParamValues(searchElement, 'countryName')
    if (searchElement.countryName) {
      searchElement.country = searchElement.countryName
      delete searchElement.countryName
    }
    this.checkEmptyParamValues(searchElement, 'beneficiaryBankCode')
    if (searchElement.beneficiaryBankCode) {
      searchElement.beneficiaryBank = searchElement.beneficiaryBankCode
      delete searchElement.beneficiaryBankCode
    }

    this.checkEmptyParamValues(searchElement, 'currency')
    this.checkEmptyParamValues(searchElement, 'amountFrom')
    this.checkEmptyParamValues(searchElement, 'amountTo')
    this.checkEmptyParamValues(searchElement, 'lastApprovalDateFrom')
    this.checkEmptyParamValues(searchElement, 'lastApprovalDateTo')
    this.checkEmptyParamValues(searchElement, 'initiatedBy')
    this.checkEmptyParamValues(searchElement, 'approvedBy')
    this.checkEmptyParamValues(searchElement, 'status')
    delete searchElement.jirahLastApprovalDateFrom
    delete searchElement.jirahLastApprovalDateTo

    this.service
      .getProcessedTransactions(searchElement)
      .pipe(first())
      .subscribe((result: any) => {
        if (result.errorCode && result.errorCode === '0') {
          this.elementsPage.page.pageSize = pageSize
          this.elementsPage.page.totalElements = +result['transfers']['total']
          this.elementsPage.page.totalPages =
            +result['transfers']['total'] / this.elementsPage.page.pageSize
          this.elementsPage.page.size =
            +result['transfers']['total'] >= this.elementsPage.page.pageSize
              ? this.elementsPage.page.pageSize
              : +result['transfers']['items'].length
          this.elementsPage.data = result['transfers']['items']
        }
      })
  }

  private checkEmptyParamValues(object: JSON, property: string) {
    if (
      object[property] === 'unefined' ||
      object[property] + '' === '' ||
      object[property] === null
    ) {
      delete object[property]
    }
  }

  getId(row: any) {
    throw new Error('Method not implemented.')
  }

  private populateRequestedSelectors() {
    this.staticService
      .getAllCombos(this.requestedSelectors)
      .subscribe((comboData) => {
        const data: any = comboData
        this.countryNameSelect = this.staticRecoverValues(
          this.requestedSelectors,
          data,
          'countryName',
        )
        this.currency = this.staticRecoverValues(
          this.requestedSelectors,
          data,
          'currency',
        )
        this.statusSelect = this.staticRecoverValues(
          this.requestedSelectors,
          data,
          'transferStatus',
        )
        //this.beneficiaryBankCode = this.staticRecoverValues(this.requestedSelectors, data, "bankCode");
        this.service.requestedCombos = [
          { comboValues: this.countryNameSelect },
          // this.service.requestedCombos = [{ 'name': 'backEndCountryCode', 'comboValues': this.countryNameSelect },
          { name: 'currency', comboValues: this.currency },
          { name: 'transferStatus', comboValues: this.statusSelect },
          { name: 'debitAccountSelect', comboValues: this.debitAccountSelect },
        ]
        this.service.getAccountsComboData().subscribe((response: any) => {
          if (response.errorCode && response.errorCode === '0') {
            this.debitAccountSelect = response.accountComboList
          }
        })
        this.service.getUsersComboData().subscribe((response: any) => {
          if (response.errorCode && response.errorCode === '0') {
            this.usersSelect = response.userIds
          }
        })
      })
  }

  public changeDateTo() {
    this.dateFrom = new Date()
    this.dateFrom.setDate(this.dateFrom.getDate())

    if (this.dateFrom) {
      const dia = new Date().getTime() + 30 * 24 * 60 * 60 * 1000 + 2
      this.minimaTo = new Date(dia)
      this.searchForm
        .get('lastApprovalDateFrom')
        .valueChanges.subscribe((val) => {
          const _dia = new Date(val).getTime() + 30 * 24 * 60 * 60 * 1000 + 2
          this.minimaTo = new Date(_dia)
        })
    }
  }

  getSearchTerms(page, rows) {
    const searchTerms = {
      amountFrom: this.searchForm.controls['amountFrom'].value,
      amountTo: this.searchForm.controls['amountTo'].value,
      approvedBy: this.searchForm.controls['approvedBy'].value,
      beneficiaryBank: this.searchForm.controls['beneficiaryBankCode'].value,
      country: this.searchForm.controls['countryName'].value,
      currency: this.searchForm.controls['currency'].value,
      debitAccount: this.searchForm.controls['debitAccount'].value,
      initiatedBy: this.searchForm.controls['initiatedBy'].value,
      lastApprovalDateFrom:
        this.searchForm.controls['lastApprovalDateFrom'].value,
      lastApprovalDateTo: this.searchForm.controls['lastApprovalDateTo'].value,
      paymentType: this.searchForm.controls['paymentType'].value,
      status: this.searchForm.controls['status'].value,
    }
    return searchTerms
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

  onChangeCountry(event) {
    console.warn('event', event)
    // Servicio que obtiene los  nombre de bancos en funci�n al pais
    this.beneficiaryBankCode = []
    // const country = event.target.value
    const country = event
    //console.log(country);
    this.subscriptions.push(
      this.service.getBankNames(country).subscribe((result) => {
        const data: any = result
        this.beneficiaryBankCode = result.banks
      }),
    )
  }

  shrinkData(data: string, breakSpacePosition = 0) {
    const stringsData = data.split(' ')
    let shrinkString = ''
    let shrinkString2 = ''
    stringsData.forEach((value, index) => {
      if (index <= breakSpacePosition) {
        shrinkString = shrinkString + value + ' '
      } else {
        shrinkString2 = shrinkString2 + value + ' '
      }
    })
    return [shrinkString, shrinkString2]
  }

  isBeneficiary(value: string) {
    if (value) {
      if (value != '') {
        return true
      }
    }
    return false
  }

  onClickRow(row: any, propName = null) {
    this.service.setSelectedItem(row);
    this.router.navigate(['/transfers/processedTransactions/details'])
}
}
