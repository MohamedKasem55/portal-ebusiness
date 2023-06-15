import { Location } from '@angular/common'
import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StadingModel } from '../../Model/standinFormModel'
import { StadingOrdersService } from '../../Services/standingOrder.services'

function MayorA1(c: FormControl) {
  if (c.value < 1) {
    return {
      noMagic: true,
    }
  }
  return null
}

@Component({
  templateUrl: '../../View/edit.standing-orders.html',
  styles: [
    `
      .head {
        margin-top: 15px;
        margin-bottom: 15px;
        padding: 15px, 0, 15px, 0;
      }
      .modal-body {
        position: relative;
        padding: 0px 30px;
        text-align: center;
      }
      .btn {
        padding: 10px 10px;
        font-size: 11px;
        line-height: 11px;
        border-radius: 2px;
      }
      .sme-checkbox.checkbox-inline,
      .sme-checkbox.radio-inline,
      .sme-checkbox label,
      .sme-radio.checkbox-inline,
      .sme-radio.radio-inline,
      .sme-radio label {
        padding-left: 22px;
        min-height: 22px;
        min-width: 22px;
        color: #595e72;
        letter-spacing: 0;
        font-size: 12px;
      }
      .bs-datepicker {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-flow: row wrap;
        flex-flow: row wrap;
        background: #fff;
        box-shadow: 0 0 10px 0 #aaa;
        position: relative;
        z-index: 1;
      }
    `,
  ],
})
export class EditStandingOrderComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any
  @ViewChild('tableLocal', { static: true }) tableL: any
  @ViewChild('template2', { static: true }) template2: any
  @ViewChild('template', { static: true }) template: any

  dateBirth: any
  minDate: { year: number; month: number; day: number }
  pro: any

  changeDetectorRef: any
  bsConfig

  authorization: any
  @ViewChild('authorization') set content(content) {
    this.authorization = content
  }
  @ViewChild(DatatableComponent, { static: true })
  tableLocal: DatatableComponent
  @ViewChild(DatatableComponent, { static: true })
  public datatableComponent: DatatableComponent

  showDateBirth = false
  showDateIssued = false
  openToCalendar = true

  dateTo = null
  dateFrom = null
  isDisabled: boolean
  openFromCalendar = true

  datepickerModel: Date
  daterangepickerModel: Date[]

  @Input() formControl: FormControl
  @Input() formData: FormData

  accountToNumber: number

  to: any

  bsValue: any

  bsRangeValue: any = [new Date(2017, 7, 4), new Date(2017, 7, 20)]

  wizardStep = 1

  dateDisabled: { date: Date; mode: string }[]

  local = []

  saad = []

  acconterSearch: number

  titleText: string

  selected: any[] = []

  selected2: any[] = []

  modalRef: BsModalRef

  rows = []

  Accountparameter: any

  accountTo: number = null

  temp = []

  temp1 = []

  loadingIndicator = true

  name: string

  columns = [
    { prop: 'bankName' },
    { name: 'name' },
    { name: 'beneficiaryAccount.fullAccountNumber' },
  ]

  onType1 = false

  onType2 = true

  beneficiaryAccount: any

  beneficiaryId: string

  bg: any = 0

  orderType1 = null

  orderType2: number

  paymentNumber: any = ''

  ownAccountsFlag: any = ''
  comboDataPurpose: any

  amount: number

  purposeTypes: any

  isValidFormSubmitted: boolean = null
  validominimo: boolean = null

  myGroup = new FormGroup({
    amounttype: new FormControl('', Validators.required),
    Accountto: new FormControl('', Validators.required),
    purpose: new FormControl('', Validators.required),
    monthfrecuency: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, MayorA1]),
    day: new FormControl('', [
      Validators.maxLength(2),
      Validators.pattern('^[0-9]*$'),
      Validators.required,
      MayorA1,
    ]),
    datefrom: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    remarks: new FormControl('', Validators.required),
  })

  user = new StadingModel()

  constructor(
    private formDataService: StadingOrdersService,
    private _location: Location,
    private router: Router,
    private builder: FormBuilder,
    private modalService: BsModalService,
    private route: ActivatedRoute,
  ) {
    super()
    this.minDate = { year: 2017, month: 1, day: 1 }
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
  }

  ngOnInit() {
    super.ngOnInit()
    this.dateFrom = new Date()
    this.to = new Date()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.isDisabled = false
    this.Accountparameter = this.route.snapshot.paramMap.get('account')

    this.formDataService.combostandingordenPurpose().subscribe((result) => {
      if (result === null) {
      } else {
        this.purposeTypes = result
      }
    })
  }

  onFormSubmit() {
    this.isValidFormSubmitted = false
    if (this.myGroup.invalid) {
      return
    }
    this.isValidFormSubmitted = true
    this.user.amounttype = this.myGroup.get('amounttype').value
    this.user.Accountto = this.myGroup.get('Accountto').value
    this.user.purpose = this.myGroup.get('purpose').value
    this.user.monthfrecuency = this.myGroup.get('monthfrecuency').value
    this.user.amount = this.myGroup.get('amount').value
    this.user.day = this.myGroup.get('day').value
    this.user.datefrom = this.myGroup.get('datefrom').value
    this.user.to = this.myGroup.get('to').value
    this.user.remarks = this.myGroup.get('remarks').value

    this.formDataService
      .addStandingOrder(
        this.Accountparameter,
        this.user.Accountto,
        this.user.amounttype,
        this.beneficiaryAccount,
        this.beneficiaryId,
        this.user.amount,
        this.user.datefrom,
        this.user.to,
        this.user.day,
        this.name,
        this.onType1,
        this.onType2,
        this.orderType1,
        this.user.monthfrecuency,
        this.ownAccountsFlag,
        this.user.purpose,
        this.user.remarks,
      )
      .subscribe((responseMsg) => {
        this.wizardStep = 2
      })
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.table) {
      tablas.push(this.table)
    }
    if (this.tableL) {
      tablas.push(this.tableL)
    }
    return tablas
  }

  goBack() {
    this.wizardStep = 1
  }

  /* PARA MOSTRAR LA INFORMACION DE LO LOCALES*/
  openModal(template: TemplateRef<any>) {
    this.template.show()
    this.titleText = 'Confirm Dialog'
    this.getBeneficiaries()
    this.loadingIndicator = true
  }

  closeModal() {
    this.modalRef.hide()
  }

  confirm() {
    this.wizardStep = 2
  }

  /* PARA MOSTRAR LA INFORMACION DE  LOS  INTERNACIONALES*/
  openModal2(template: TemplateRef<any>) {
    this.template2.show()
    this.getBeneficiaries()
    this.titleText = 'confirmacion y listo'
    this.loadingIndicator = true
  }

  getBeneficiaries() {
    if (this.local.length == 0 || this.saad.length == 0) {
      this.formDataService
        .getBeneficiaries(this.Accountparameter)
        .subscribe((data) => {
          if (data['errorCode'] != '0') {
            this.template.hide()
            this.template2.hide()
            this.loadingIndicator = false
          } else {
            this.local = data['beneficiaryList'].filter((x) => x.type === '02')
            this.temp = [...this.local]

            this.saad = data['beneficiaryList'].filter((x) => x.type === '01')
            this.temp1 = [...this.saad]
            this.loadingIndicator = false
          }
        })
    }
  }

  getDateString(date: Date): string {
    return (
      date.getDate()! + '/' + (date.getMonth() + 1)! + '/' + date.getFullYear()!
    )
  }

  addStandindOrder(myGroup: any): void {
    this.formDataService
      .addStandingOrder(
        this.Accountparameter,
        this.myGroup.value.Accountto,
        this.myGroup.value.amounttype,
        this.beneficiaryAccount,
        this.beneficiaryId,
        this.myGroup.value.amount,
        this.myGroup.value.from,
        this.myGroup.value.to,
        this.myGroup.value.day,
        this.name,
        this.onType1,
        this.onType2,
        this.orderType1,
        this.myGroup.value.monthfrecuency,
        this.ownAccountsFlag,
        this.myGroup.value.purpose,
        this.myGroup.value.remarks,
      )
      .subscribe((responseMsg) => (this.wizardStep = 2))
  }

  onSelectLocal($event) {
    const valor = $event.selected[0].beneficiaryAccount.fullAccountNumber
    this.accountTo = valor
    this.beneficiaryAccount = valor
    this.beneficiaryId = $event.selected[0].beneficiaryId
    this.name = $event.selected[0].name
    const vertype = $event.selected[0].type

    if (vertype === '02') {
      this.ownAccountsFlag = 'N'
    } else {
      this.ownAccountsFlag = 'N'
    }
    this.template.hide()
  }

  onSelectLocalMobile(row) {
    const valor = row.beneficiaryAccountCode
    this.accountTo = valor
    this.beneficiaryAccount = valor
    this.beneficiaryId = row.beneficiaryId
    this.name = row.name
    const vertype = row.type

    if (vertype === '02') {
      this.ownAccountsFlag = 'N'
    } else {
      this.ownAccountsFlag = 'N'
    }
    this.template.hide()
  }

  onSelectInternacional($event) {
    const valor = $event.selected[0].beneficiaryAccount.fullAccountNumber
    this.accountTo = valor
    this.beneficiaryAccount = valor
    this.beneficiaryId = $event.selected[0].beneficiaryId
    this.name = $event.selected[0].name
    const vertype = $event.selected[0].type

    if (vertype === '02') {
      this.ownAccountsFlag = 'N'
    } else {
      this.ownAccountsFlag = 'N'
    }
    this.template2.hide()
  }

  onSelectInternacionalMobile(row) {
    const valor = row.beneficiaryAccount.fullAccountNumber
    this.accountTo = valor
    this.beneficiaryAccount = valor
    this.beneficiaryId = row.beneficiaryId
    this.name = row.name
    const vertype = row.type

    if (vertype === '02') {
      this.ownAccountsFlag = 'N'
    } else {
      this.ownAccountsFlag = 'N'
    }
    this.template2.hide()
  }

  updateFilter(event) {
    this.loadingIndicator = true
    const val = event.target.value.toLowerCase()
    this.formDataService
      .getBeneficiaries(this.Accountparameter)
      .subscribe((data) => {
        this.saad = data['beneficiaryList'].filter((x) => x.type === '01')
        this.temp1 = [...this.saad]
        this.temp1 = this.saad.filter(
          (row) => row.name.toLowerCase().indexOf(val) !== -1 || !val,
        )
        this.saad = this.temp1

        this.local = data['beneficiaryList'].filter((x) => x.type === '02')
        this.temp = [...this.local]
        this.temp = this.local.filter(
          (row) => row.name.toLowerCase().indexOf(val) !== -1 || !val,
        )
        this.local = this.temp

        this.loadingIndicator = false
      })
  }

  valid() {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }
}
