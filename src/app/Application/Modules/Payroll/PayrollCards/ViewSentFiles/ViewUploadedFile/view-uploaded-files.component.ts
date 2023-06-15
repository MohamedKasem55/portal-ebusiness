import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { ViewSentFilesService } from '../view-sent-files.service'

@Component({
  selector: 'app-view-uploaded-files',
  templateUrl: './view-uploaded-files.component.html',
})
export class ViewUploadedFilesComponent {
  sharedData: any = {}
  currentComponent: any
  getviewSentFilesSubscription: Subscription
  viewSentFilesResults: any = {}
  tableDisplaySize = 20
  companyName: any
  companyCIC: any
  wizardStep: number

  subscription: Subscription

  constructor(
    private router: Router,
    public translate: TranslateService,
    private viewSentFilesService: ViewSentFilesService,
  ) {}

  backViewSentFiles() {
    this.router.navigate(['/payroll/payroll-cards/view-sent-files'])
  }

  backViewUploadedFiles() {
    this.router.navigate([
      '/payroll/payroll-cards/view-sent-files/view-uploaded-files',
    ])
  }

  back() {
    this.wizardStep--
    this.router.navigate([
      '/payroll/payroll-cards/view-sent-files/view-uploaded-files/delete-files-uploaded' +
        this.wizardStep,
    ])
  }

  proceed() {
    //console.log("Proceed: " + this.sharedData);
    this.router.navigate([
      '/payroll/payroll-cards/view-sent-files/view-uploaded-files/delete-files-uploaded2',
    ])
  }

  confirm() {
    //console.log(this.sharedData.tableSelected);
    this.viewSentFilesService
      .deleteFiles(this.sharedData.tableSelected)
      .subscribe((result) => {
        if (!result.error) {
          this.router.navigate([
            '/payroll/payroll-cards/view-sent-files/view-uploaded-files/delete-files-uploaded3',
          ])
        }
      })
  }

  accept() {
    this.router.navigate(['/payroll/payroll-cards/view-sent-files'])
  }

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    this.wizardStep = component.step

    if (component.step !== 1 && component.step !== 4) {
      if (Object.keys(this.sharedData).length === 0) {
        this.router.navigate([
          '/payroll/payroll-cards/view-sent-files/view-uploaded-files/delete-files-uploaded1',
        ])
      }
    }
  }
}
