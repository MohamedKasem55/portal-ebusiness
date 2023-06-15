import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { FeedBackFilesService } from './feedback-files-list.service'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { switchMap } from 'rxjs/operators'
import { Exception } from '../../../Model/exception'

@Component({
  templateUrl: './feedback-files-details.component.html',
})
export class FeedBackFilesDetailComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('downloadedFiles', { static: true }) table: any

  wizardStep = 1

  fileDetail = []
  fileName: any
  fileSelected: any
  subscriptions: Subscription[] = []

  constructor(
    private feedBackFiles: FeedBackFilesService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  onError(result) {}

  ngOnInit() {
    super.ngOnInit()
    this.fileName = this.feedBackFiles.getFileName()
    this.subscriptions.push(
      this.feedBackFiles
        .getFileSelected()
        .pipe(
          switchMap((file) => {
            this.fileSelected = file
            return this.feedBackFiles.details(file.fileReference)
          }),
        )
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.fileDetail = result.listLinesBillPaymentFiles
            this.fileDetail.forEach((f) => {
              this.translate.currentLang == 'ar'
                ? (f.billName = f.billNameAr)
                : (f.billName = f.billNameEn)
              f.billProcess = f.process
            })
          }
        }),
    )
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.fileDetail.forEach((x) => {
          this.translate.currentLang == 'ar'
            ? (x.billName = x.billNameAr)
            : (x.billName = x.billNameEn)
        })
      }),
    )
  }

  onDetailToggle(event) {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  returnToFeedBack() {
    this.router.navigate(['/payments/billPayments/feedbackfiles'])
  }

  confirmDeleteFeedBack() {
    this.subscriptions.push(
      this.feedBackFiles.delete(this.fileSelected).subscribe((result) => {
        if (
          result.hasOwnProperty('error') &&
          (<any>result).error instanceof Exception
        ) {
          this.onError(result)
          return
        } else {
          this.wizardStep = 3
        }
      }),
    )
  }

  deleteFeedBack() {
    this.wizardStep = 2
  }
}
