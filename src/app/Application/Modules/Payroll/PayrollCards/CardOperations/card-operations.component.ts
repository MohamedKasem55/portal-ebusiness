import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { interval, Subscription } from 'rxjs'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
//Service
import { CardOperationsService } from './card-operations.service'

@UntilDestroy()
@Component({
  selector: 'app-card-operations',
  templateUrl: './card-operations.component.html',
})
export class CardOperationsComponent implements OnInit {
  step: number
  wizardStep: number
  sharedData: any = {}
  generateChallengeAndOTP = new ResponseGenerateChallenge()
  requestValidate = new RequestValidate()
  actualForm: NgForm
  closeServicePayRollOperation: Subscription
  currentComponent: any

  constructor(
    private service: CardOperationsService,
    private router: Router,
    private pendingActionNotification: PendingActionsNotificaterService,
  ) {
    //this.step=1;
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.step = 1
  }

  componentAdded(component) {
    ////console.log("Ejecución metodo componentAdded");
    ////console.log("Step hijo: ", component.step);
    component.sharedData = this.sharedData
    this.wizardStep = component.step
    this.actualForm = component.stepForm
    this.currentComponent = component
    if (component.step !== 1) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate(['/payroll/payroll-cards/card-operations/step1'])
      }
    }
  }

  backCardInquiries() {
    this.router.navigate(['/payroll/payroll-cards'])
  }

  back() {
    this.wizardStep--
    this.step = this.wizardStep
    if (this.wizardStep === 1) {
      this.sharedData.selectedRows = []
    }
    this.router.navigate([
      '/payroll/payroll-cards/card-operations/step' + this.wizardStep,
    ])
  }

  finish() {
    this.wizardStep = 1
    this.step = 1
    this.sharedData.selectedRows = []
    this.router.navigate(['/payroll/payroll-cards/card-operations/step1'])
  }

  fourSteps() {
    if (
      ['A', 'C', '8', '2', 'B', 'LD', 'PR', 'NI', 'SN', 'SI'].indexOf(
        this.sharedData.operationType,
      ) > -1
    ) {
      return true
    }
    return false
  }

  prepareSelectData() {
    const selectedRows = this.sharedData.selectedRows
    this.sharedData.newValue = []
    for (let i = 0; i < selectedRows.length; i++) {
      this.sharedData.selectedRows[i]['cardHolderNameOld'] =
        this.sharedData.selectedRows[i].cardHolderName
      this.sharedData.selectedRows[i]['memberIdOld'] =
        this.sharedData.selectedRows[i].memberId
      this.sharedData.selectedRows[i]['nationalIdOld'] =
        this.sharedData.selectedRows[i].nationalId
      this.sharedData.selectedRows[i]['totalAmountOld'] =
        this.sharedData.selectedRows[i].totalAmount
      this.sharedData.selectedRows[i]['salaryBasisOld'] =
        this.sharedData.selectedRows[i].salaryBasis
      this.sharedData.selectedRows[i]['homeAllowanceOld'] =
        this.sharedData.selectedRows[i].homeAllowance
      this.sharedData.selectedRows[i]['allowanceOthersOld'] =
        this.sharedData.selectedRows[i].allowanceOthers
      this.sharedData.selectedRows[i]['deductionsOld'] =
        this.sharedData.selectedRows[i].deductions

      this.sharedData.newValue.push({
        cardHolderName: null,
        memberId: null,
        totalAmount: null,
        nationalId: this.sharedData.selectedRows[i].nationalId,
        ammount: null,
        salaryBasis: null,
        homeAllowance: null,
        allowanceOthers: null,
        deductions: null,
      })
    }
  }

  proceed() {
    switch (this.step) {
      case 1:
        this.prepareSelectData()
        if (this.fourSteps()) {
          this.step = 2
          this.router.navigate(['/payroll/payroll-cards/card-operations/step2'])
        } else {
          this.sharedData.generateChallengeAndOTP =
            new ResponseGenerateChallenge()
          this.sharedData.requestValidate = new RequestValidate()

          const _data = {
            cardsSelected: this.sharedData.selectedRows,
            operationCodeNumber: this.sharedData.operationCode,
          }
          this.closeServicePayRollOperation = this.service
            .validateMultiple(JSON.stringify(_data))
            .subscribe((result) => {
              this.sharedData.batchListsContainer =
                result['batchListsContainer']
              this.sharedData.batch = this.extractBatch(
                result['batchListsContainer'],
              )
              this.sharedData.mapSecurity = this.generateLevelsMap(
                this.sharedData.batch,
              )
              this.sharedData.operationType = result['operationType']
              this.generateChallengeAndOTP = result['generateChallengeAndOTP']
              this.sharedData.generateChallengeAndOTP =
                result['generateChallengeAndOTP']

              this.sharedData.operation = result['operationType']
              this.sharedData.fee = result['fee']
              this.step = 2
              this.router.navigate([
                '/payroll/payroll-cards/card-operations/step2',
              ])
            })
        }
        break
      case 2:
        this.updateSelectedRows()

        this.sharedData.generateChallengeAndOTP =
          new ResponseGenerateChallenge()
        this.sharedData.requestValidate = new RequestValidate()
        const _data2 = {
          cardsSelected: this.sharedData.selectedRows,
          operationCodeNumber: this.sharedData.operationCode,
        }
        this.closeServicePayRollOperation = this.service
          .validateMultiple(JSON.stringify(_data2))
          .subscribe((result) => {
            this.sharedData.batchListsContainer = result['batchListsContainer']
            this.sharedData.batch = this.extractBatch(
              result['batchListsContainer'],
            )
            this.sharedData.mapSecurity = this.generateLevelsMap(
              this.sharedData.batch,
            )
            this.sharedData.operationType = result['operationType']
            this.generateChallengeAndOTP = result['generateChallengeAndOTP']
            this.sharedData.generateChallengeAndOTP =
              result['generateChallengeAndOTP']

            this.sharedData.operation = result['operationType']
            this.sharedData.fee = result['fee']
            this.step = 3

            this.router.navigate([
              '/payroll/payroll-cards/card-operations/step3',
            ])
          })
        break
    }
  }

  generateLevelsMap(batch) {
    const map = new Map<string, any>()
    for (let i = batch.length - 1; i >= 0; i--) {
      map.set(batch[i].cardNumber, batch[i].futureSecurityLevelsDTOList)
    }
    return map
  }

  extractBatch(batchList) {
    const list: any = []
    for (let i = 0; i < batchList.notAllowed.length; i++) {
      list.push(batchList.notAllowed[i])
    }
    for (let i = 0; i < batchList.toProcess.length; i++) {
      list.push(batchList.toProcess[i])
    }
    for (let i = 0; i < batchList.toAuthorize.length; i++) {
      list.push(batchList.toAuthorize[i])
    }
    return list
  }

  updateSelectedRows() {
    for (let i = this.sharedData.selectedRows.length - 1; i >= 0; i--) {
      if (this.sharedData.newValue[i].cardHolderName) {
        this.sharedData.selectedRows[i].cardHolderName =
          this.sharedData.newValue[i].cardHolderName
      }

      if (this.sharedData.newValue[i].employeeId) {
        this.sharedData.selectedRows[i].memberId =
          this.sharedData.newValue[i].employeeId
      }

      if (this.sharedData.newValue[i].nationalId) {
        this.sharedData.selectedRows[i].nationalId =
          this.sharedData.newValue[i].nationalId
      }

      if (this.sharedData.newValue[i].ammount) {
        this.sharedData.selectedRows[i].currentBalance =
          this.sharedData.newValue[i].ammount
      }

      if (this.sharedData.newValue[i].salaryBasis) {
        this.sharedData.selectedRows[i].salaryBasis =
          this.sharedData.newValue[i].salaryBasis
      }

      if (this.sharedData.newValue[i].homeAllowance) {
        this.sharedData.selectedRows[i].homeAllowance =
          this.sharedData.newValue[i].homeAllowance
      }

      if (this.sharedData.newValue[i].allowanceOthers) {
        this.sharedData.selectedRows[i].allowanceOthers =
          this.sharedData.newValue[i].allowanceOthers
      }

      if (this.sharedData.newValue[i].deductions) {
        this.sharedData.selectedRows[i].deductions =
          this.sharedData.newValue[i].deductions
      }
    }
  }

  updateBatchdRows() {
    for (
      let i = this.sharedData.batchListsContainer.toAuthorize.length - 1;
      i >= 0;
      i--
    ) {
      if (this.sharedData.newValue[i].cardHolderName) {
        this.sharedData.batchListsContainer.toAuthorize[i].cardHolderName =
          this.sharedData.newValue[i].cardHolderName
      }

      if (this.sharedData.newValue[i].employeeId) {
        this.sharedData.batchListsContainer.toAuthorize[i].memberId =
          this.sharedData.newValue[i].employeeId
      }

      if (this.sharedData.newValue[i].nationalId) {
        this.sharedData.batchListsContainer.toAuthorize[i].nationalId =
          this.sharedData.newValue[i].nationalId
      }

      if (this.sharedData.newValue[i].ammount) {
        this.sharedData.batchListsContainer.toAuthorize[i].currentBalance =
          this.sharedData.newValue[i].ammount
      }

      if (this.sharedData.newValue[i].salaryBasis) {
        this.sharedData.batchListsContainer.toAuthorize[i].salaryBasis =
          this.sharedData.newValue[i].salaryBasis
      }

      if (this.sharedData.newValue[i].housingAllowance) {
        this.sharedData.batchListsContainer.toAuthorize[i].homeAllowance =
          this.sharedData.newValue[i].housingAllowance
      }

      if (this.sharedData.newValue[i].otherAllowance) {
        this.sharedData.batchListsContainer.toAuthorize[i].allowanceOthers =
          this.sharedData.newValue[i].otherAllowance
      }

      if (this.sharedData.newValue[i].deduction) {
        this.sharedData.batchListsContainer.toAuthorize[i].deductions =
          this.sharedData.newValue[i].deduction
      }

      if (
        this.sharedData.newValue[i].deduction ||
        this.sharedData.newValue[i].otherAllowance ||
        this.sharedData.newValue[i].housingAllowance ||
        this.sharedData.newValue[i].salaryBasis
      ) {
        this.sharedData.batchListsContainer.toAuthorize[i].amount =
          +this.sharedData.batchListsContainer.toAuthorize[i].salaryBasis +
          +this.sharedData.batchListsContainer.toAuthorize[i].homeAllowance +
          +this.sharedData.batchListsContainer.toAuthorize[i].allowanceOthers -
          +this.sharedData.batchListsContainer.toAuthorize[i].deductions
      }
    }

    for (
      let i = this.sharedData.batchListsContainer.toProcess.length - 1;
      i >= 0;
      i--
    ) {
      if (this.sharedData.newValue[i].cardHolderName) {
        this.sharedData.batchListsContainer.toProcess[i].cardHolderName =
          this.sharedData.newValue[i].cardHolderName
      }

      if (this.sharedData.newValue[i].employeeId) {
        this.sharedData.batchListsContainer.toProcess[i].memberId =
          this.sharedData.newValue[i].employeeId
      }

      if (this.sharedData.newValue[i].nationalId) {
        this.sharedData.batchListsContainer.toProcess[i].nationalId =
          this.sharedData.newValue[i].nationalId
      }

      if (this.sharedData.newValue[i].ammount) {
        this.sharedData.batchListsContainer.toProcess[i].currentBalance =
          this.sharedData.newValue[i].ammount
      }

      if (this.sharedData.newValue[i].salaryBasis) {
        this.sharedData.batchListsContainer.toProcess[i].salaryBasis =
          this.sharedData.newValue[i].salaryBasis
      }

      if (this.sharedData.newValue[i].housingAllowance) {
        this.sharedData.batchListsContainer.toProcess[i].homeAllowance =
          this.sharedData.newValue[i].housingAllowance
      }

      if (this.sharedData.newValue[i].otherAllowance) {
        this.sharedData.batchListsContainer.toProcess[i].allowanceOthers =
          this.sharedData.newValue[i].otherAllowance
      }

      if (this.sharedData.newValue[i].deduction) {
        this.sharedData.batchListsContainer.toProcess[i].deductions =
          this.sharedData.newValue[i].deduction
      }

      if (
        this.sharedData.newValue[i].deduction ||
        this.sharedData.newValue[i].otherAllowance ||
        this.sharedData.newValue[i].housingAllowance ||
        this.sharedData.newValue[i].salaryBasis
      ) {
        this.sharedData.batchListsContainer.toProcess[i].amount =
          +this.sharedData.batchListsContainer.toProcess[i].salaryBasis +
          +this.sharedData.batchListsContainer.toProcess[i].homeAllowance +
          +this.sharedData.batchListsContainer.toProcess[i].allowanceOthers -
          +this.sharedData.batchListsContainer.toProcess[i].deductions
      }
    }
  }

  confirm() {
    const data: any = {}

    data.batchListsContainer = this.sharedData.batchListsContainer
    data.requestValidate = {
      challengeNumber: this.sharedData.requestValidate.challengeNumber,
      challengeResponse: this.sharedData.requestValidate.challengeResponse,
      otp: this.sharedData.requestValidate.otp,
      password: this.sharedData.requestValidate.password,
    }
    data.operationType = this.sharedData.operationType

    // Service Call /payrollCards/operations/validateMultiple
    this.closeServicePayRollOperation = this.service
      .confirmMultiple(data)
      .subscribe((result) => {
        if (result['errorCode'] == 0) {
          this.sharedData.validation = result
          this.step = 4
          this.pendingActionNotification.getRefreshObserver().next(true)
          this.router.navigate(['/payroll/payroll-cards/card-operations/step4'])
        }
      })
  }

  validStepForms() {
    if (this.step == 2) {
      if (
        this.sharedData.operationCode === '2' &&
        this.sharedData.layout === 'wps'
      ) {
        return (
          this.sharedData['validFormData'] === null ||
          this.sharedData['validFormData'] === undefined ||
          this.sharedData['validFormData'] === true
        )
      }
    }
    return true
  }
}
