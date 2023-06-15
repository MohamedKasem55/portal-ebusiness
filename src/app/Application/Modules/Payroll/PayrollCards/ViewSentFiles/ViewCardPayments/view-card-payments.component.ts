import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { ViewSentFilesService } from '../view-sent-files.service'

@Component({
  selector: 'app-card-payments-files',
  templateUrl: './view-card-payments.component.html',
})
export class ViewCardPaymentsComponent {
  sharedData: any = {}
  getViewCardPaymentsSubscription: Subscription
  viewCardPaymentsResults: any = {}
  tableDisplaySize = 20
  companyName: any
  companyCIC: any
  wizardStep: number

  constructor(
    private viewSentFilesService: ViewSentFilesService,
    private router: Router,
    public translate: TranslateService,
    private storage: StorageService,
  ) {}

  // tslint:disable-next-line:use-life-cycle-interface

  backViewSentFiles() {
    this.router.navigate(['/payroll/payroll-cards/view-sent-files'])
  }

  backViewUploadedFiles() {
    this.router.navigate([
      '/payroll/payroll-cards/view-sent-files/view-card-payments',
    ])
  }

  back() {
    this.wizardStep--
    this.router.navigate([
      '/payroll/payroll-cards/view-sent-files/view-card-payments/delete-files-card' +
        this.wizardStep,
    ])
  }

  proceed() {
    this.router.navigate([
      '/payroll/payroll-cards/view-sent-files/view-card-payments/delete-files-card2',
    ])
  }

  confirm() {
    //console.log(this.sharedData.tableSelected);
    this.viewSentFilesService
      .deleteFiles(this.sharedData.tableSelected)
      .subscribe((result) => {
        if (!result.error) {
          this.router.navigate([
            '/payroll/payroll-cards/view-sent-files/view-card-payments/delete-files-card3',
          ])
        }
      })
  }
  accept() {
    this.router.navigate(['/payroll/payroll-cards/view-sent-files'])
  }

  componentAdded(component) {
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1 || component.step !== 4) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate([
          '/payroll/payroll-cards/view-sent-files/view-card-payments/delete-files-card1',
        ])
      }
    }
  }
}
