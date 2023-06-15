import { DecimalPipe } from '@angular/common'
import { Component, Inject, LOCALE_ID, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { PayrollCardsService } from '../payroll-cards.service'

@Component({
  selector: 'app-card-operations-step2',
  templateUrl: './card-operations-step2.component.html',
})
export class CardOperationsStep2Component implements OnInit {
  @ViewChild('authorization') authorization: any
  @ViewChild('stepForm', { static: true }) stepForm: NgForm
  sharedData: any = {}

  step = 2
  isCollapsedContent: boolean[]
  selectedRows: any = [{}]
  newValue: any[] = []

  operation = ''
  fee = 0

  constructor(
    private payrollCardsService: PayrollCardsService,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  ngOnInit() {
    this.payrollCardsService.getInstitution().subscribe((result) => {
      this.sharedData.instituteId = result.institutionDTO.institutionId
      this.sharedData.layout = result.institutionDTO.layout
      this.sharedData.institutionType = result.institutionDTO.institutionType
    })

    const decimalPipe = new DecimalPipe(this.locale)
    for (let i = 0; i < this.sharedData.newValue.length; i++) {
      this.sharedData.newValue[i].ammount =
        this.sharedData.newValue[i].ammount === null
          ? decimalPipe.transform(0, '1.2-2').replace(/,/g, '')
          : this.sharedData.newValue[i].ammount
      this.sharedData.newValue[i].salaryBasis =
        this.sharedData.newValue[i].salaryBasis === null
          ? decimalPipe.transform(0, '1.2-2').replace(/,/g, '')
          : this.sharedData.newValue[i].salaryBasis
      this.sharedData.newValue[i].homeAllowance =
        this.sharedData.newValue[i].homeAllowance === null
          ? decimalPipe.transform(0, '1.2-2').replace(/,/g, '')
          : this.sharedData.newValue[i].homeAllowance
      this.sharedData.newValue[i].allowanceOthers =
        this.sharedData.newValue[i].allowanceOthers === null
          ? decimalPipe.transform(0, '1.2-2').replace(/,/g, '')
          : this.sharedData.newValue[i].allowanceOthers
      this.sharedData.newValue[i].deductions =
        this.sharedData.newValue[i].deductions === null
          ? decimalPipe.transform(0, '1.2-2').replace(/,/g, '')
          : this.sharedData.newValue[i].deductions
    }

    if (
      this.sharedData.selectedRows &&
      this.sharedData.selectedRows.length > 0
    ) {
      this.isCollapsedContent = Array(this.sharedData.selectedRows.length).fill(
        false,
      )
    }
    this.selectedRows = this.sharedData.selectedRows
    this.newValue = this.sharedData.newValue

    if (this.fourSteps()) {
      this.operation = this.sharedData.operationType
    } else {
      this.operation = this.sharedData.operation
      this.fee = this.sharedData.fee
    }
    // Service Call /payrollCards/operations/validateMultiple
  }

  getFromLevelsMap() {
    return this.sharedData.mapSecurity.entries().next().value[1]
    // return this.sharedData.mapSecurity.get(number);
  }

  fourSteps() {
    if (
      ['A', 'C', '8', 'B', 'LD', 'PR', 'NI', 'SN', 'SI'].indexOf(
        this.sharedData.operationType,
      ) > -1
    ) {
      return true
    }
    return false
  }

  valid() {
    return this.authorization.valid()
  }

  validAmount(amount: any) {
    if (typeof amount === 'undefined') {
      return false
    }
    return amount.errors
  }

  validAmountSalary(i) {
    this.validAllAmountSalary()

    return this.validRowAmountSalary(i)
  }

  validRowAmountSalary(i) {
    if (
      this.sharedData.newValue[i].ammount == null ||
      this.sharedData.newValue[i].ammount == undefined ||
      this.sharedData.newValue[i].salaryBasis == null ||
      this.sharedData.newValue[i].salaryBasis == undefined ||
      this.sharedData.newValue[i].homeAllowance == null ||
      this.sharedData.newValue[i].homeAllowance == undefined ||
      this.sharedData.newValue[i].allowanceOthers == null ||
      this.sharedData.newValue[i].allowanceOthers == undefined ||
      this.sharedData.newValue[i].deductions == null ||
      this.sharedData.newValue[i].deductions == undefined
    ) {
      return true
    }
    return (
      parseFloat(this.sharedData.newValue[i].ammount) ==
      parseFloat(this.sharedData.newValue[i].salaryBasis) +
        parseFloat(this.sharedData.newValue[i].homeAllowance) +
        parseFloat(this.sharedData.newValue[i].allowanceOthers) -
        parseFloat(this.sharedData.newValue[i].deductions)
    )
  }

  validAllAmountSalary() {
    this.sharedData['validFormData'] = true

    this.sharedData.newValue.forEach((row, i) => {
      if (!this.validRowAmountSalary(i)) {
        this.sharedData['validFormData'] = false
      }
    })
  }
}
