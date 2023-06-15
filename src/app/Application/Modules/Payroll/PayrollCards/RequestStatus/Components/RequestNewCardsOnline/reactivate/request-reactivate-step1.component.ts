import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'
import { RequestReactivateNewCardService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-new-card-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateNewCardStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('payrollCardPageTable', { static: true }) table: any

  @Input() batch: any
  @Input() cic: any
  @Input() companyName: any
  @Output() onInit = new EventEmitter<Component>()

  PaymentPageSize = 20

  employeesAdded = 0
  bsConfig: any
  employeesNumber: number[] = []
  employee = {
    amount: '',
    departmentId: null,
    employeeId: '',
    employeeName: '',
    mobileNumber: null,
    nationalId: '',
    userReference: null,
  }

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateNewCardService,
    public translate: TranslateService,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.onInit.emit(this as Component)
    this.employeesAdded = this.batch.details.length
  }

  addEmployee() {
    this.batch.details.push(this.employee)
    this.batch.details = [...this.batch.details]
  }

  clearEmployees() {
    this.batch.details = []
    this.addEmployee()
  }

  removeEmployee(rowId) {
    delete this.batch.details[rowId]
    this.batch.details.splice(rowId, 1)
    this.batch.details = [...this.batch.details]
  }

  updateValue(event, cell, rowIndex) {
    this.batch.details[rowIndex][cell] = event.target.value
  }

  errors(data) {
    let error = false
    for (let i = 0; i < data.length; i++) {
      error = error || this.checkError(data[i], i)
    }
    return error
  }

  checkError(data, index) {
    let naitonalId = ''
    let error = false
    data['errors'] = {}
    data['errors']['lt'] = false
    data['errors']['required'] = false
    naitonalId = data.nationalId
    if (naitonalId.length < 10) {
      error = true
      data['errors']['lt'] = true
    }
    if (!naitonalId || !data.employeeId || !data.employeeName) {
      error = true
      data['errors']['required'] = true
    }
    data['errors']['error'] = error
    return error
  }

  ngOnDestroy() {}

  valid() {
    return this.errors(this.batch.details)
  }
}
