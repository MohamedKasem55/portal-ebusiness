import { Component, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { RequestNewCardOnlineService } from '../../request-new-card-online.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  @ViewChild('stepForm', { static: true }) stepForm: NgForm

  step = 1
  sharedData: any = {}

  employeesAdded = 0
  employeesNumber = []

  institutionSubscription: Subscription

  constructor(
    private service: RequestNewCardOnlineService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.sharedData.employees = {}
    this.addEmployee()
  }

  addEmployee() {
    this.sharedData.employees[this.employeesAdded] = {}

    if (
      'group' === this.sharedData.institutionDTO.layout ||
      ('group' === this.sharedData.institutionDTO.institutionType &&
        'wps' === this.sharedData.institutionDTO.layout)
    ) {
      if (this.sharedData.departmentListSelected) {
        this.sharedData.employees[this.employeesAdded].departmentId =
          this.sharedData.departmentListSelected
      }
    }

    this.employeesNumber.push(this.employeesAdded++)
  }

  clearEmployees() {
    this.employeesNumber = []
    this.sharedData.employees = {}
    this.addEmployee()
  }

  removeEmployee(rowId) {
    for (let i = this.employeesNumber.length - 1; i >= 0; i--) {
      if (this.employeesNumber[i] === rowId) {
        delete this.sharedData.employees[rowId]
        this.employeesNumber.splice(i, 1)
        break
      }
    }
  }
}
