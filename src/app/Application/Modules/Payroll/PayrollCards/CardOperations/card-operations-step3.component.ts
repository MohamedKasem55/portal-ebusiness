import { Component, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'

@Component({
  selector: 'app-card-operations-step3',
  templateUrl: './card-operations-step3.component.html',
})
export class CardOperationsStep3Component implements OnInit {
  @ViewChild('authorization') authorization: any
  @ViewChild('stepForm', { static: true }) stepForm: NgForm
  sharedData: any = {}

  step = 3
  isCollapsedContent: boolean[]

  selectedRows: any = [{}]
  newValue: any[] = []
  operation = ''
  fee = 0

  constructor() {}

  ngOnInit() {
    ////console.log("Operation type");
    ////console.log(this.sharedData.operationType);
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
    ////console.log("Tarjetas selccionadas");
    ////console.log(cardSelecteds);
    this.operation = this.sharedData.operation
    this.fee = this.sharedData.fee

    // Service Call /payrollCards/operations/validateMultiple
  }

  getFromLevelsMap(number: any) {
    return this.sharedData.mapSecurity.get(number)
  }

  valid() {
    return this.authorization.valid()
  }
}
