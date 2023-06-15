import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { PayrollCardsService } from '../../payroll-cards.service'
import { RequestNewCardOnlineService } from './request-new-card-online.service'

@Component({
  templateUrl: './request-new-card-online.component.html',
})
export class RequestNewCardOnlineComponent implements OnInit {
  wizardStep: number
  sharedData: any = {}
  currentComponent: any
  subscription: Subscription

  actualForm: NgForm

  constructor(
    private payrollCardsService: PayrollCardsService,
    private service: RequestNewCardOnlineService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.sharedData.institutionDTO = {}
    this.subscription = this.payrollCardsService
      .getInstitution()
      .subscribe((result) => {
        if (!result.error) {
          this.sharedData.institutionDTO = result.institutionDTO
          this.sharedData.departments = result.departments
          this.sharedData.departmentListSelected = result.departmentListSelected
        }
        if (typeof this.subscription != 'undefined') {
          this.subscription.unsubscribe()
        }
      })
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step
    this.actualForm = component.stepForm
    this.currentComponent = component
    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate([
          '/payroll/payroll-cards/card-inquiries/request-new-card-online/step1',
        ])
      }
    }
  }

  backCardInquiries() {
    this.router.navigate(['/payroll/payroll-cards/card-inquiries'])
  }

  back() {
    this.wizardStep--
    this.router.navigate([
      '/payroll/payroll-cards/card-inquiries/request-new-card-online/step' +
        this.wizardStep,
    ])
  }

  proceed() {
    const listNewPayrollcardsDetailSelected = []
    for (const employee in this.sharedData.employees) {
      if (this.sharedData.employees[employee]) {
        listNewPayrollcardsDetailSelected.push(
          this.sharedData.employees[employee],
        )
      }
    }
    this.subscription = this.service
      .initiate(this.sharedData.batchName, listNewPayrollcardsDetailSelected)
      .subscribe((result) => {
        this.subscription.unsubscribe()
        if (!result.error) {
          const rest = result.payrollCardBatch.details
          result.payrollCardBatch.details = []
          for (let i = 0; i < listNewPayrollcardsDetailSelected.length; i++) {
            for (let j = 0; j < rest.length; j++) {
              if (
                listNewPayrollcardsDetailSelected[i].menberId ==
                rest[j].employeeId
              ) {
                result.payrollCardBatch.details.push(rest[j])
                break
              }
            }
          }
          this.sharedData.responseInitiateNewCard = result
          this.router.navigate([
            '/payroll/payroll-cards/card-inquiries/request-new-card-online/step2',
          ])
        }
      })
  }

  confirm() {
    this.subscription = this.service
      .initiateConfirm(
        this.sharedData.responseInitiateNewCard.payrollCardBatch,
        this.sharedData.requestValidate,
      )
      .subscribe((result) => {
        this.subscription.unsubscribe()
        if (!result.error) {
          this.sharedData.processed = result.processed
          this.router.navigate([
            '/payroll/payroll-cards/card-inquiries/request-new-card-online/step3',
          ])
        }
      })
  }

  isValid() {
    return this.currentComponent.valid()
  }
}
