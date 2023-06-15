import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../Common/Services/static.service'
import { CardReportsService } from './card.reports.service'

@Component({
  templateUrl: './card.reports.component.html',
  styleUrls: ['./card.reports.component.scss'],
})
export class CardReportsComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  selectAllOnPage: any = []

  constructor(
    public fb: FormBuilder,
    public service: CardReportsService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'batchName'
    this.orderType = 'desc'

    this.searchForm = this.fb.group({})
  }

  ngOnInit() {
    this.search()

    super.ngOnInit()
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
          }
        }),
    )
  }

  isDisabled() {
    return !(this.tableSelectedRows && this.tableSelectedRows.length > 0)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return (
      row['fileName'] + row['fileSize'] + row['batchName'] + row['dataReceived']
    )
  }

  reset() {
    //this.searchForm.controls.status.reset();
    //this.searchForm.controls.type.reset();
    //this.searchForm.controls.userId.reset();
    //this.searchForm.controls.userName.reset();
    this.search()
  }

  refreshData() {}

  getAllTables() {
    return []
  }

  onDetailToggle(event) {}

  downloadSelectedFiles() {
    const selectedFiles = this.tableSelectedRows
    this.subscriptions.push(
      this.service.downloadFiles(selectedFiles).subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
        }
      }),
    )
  }

  downloadFile(file) {
    const selectedFiles = [file]
    this.subscriptions.push(
      this.service.downloadFiles(selectedFiles).subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
        }
      }),
    )
  }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    //console.log('---select one---');
    //
    this.selectAllOnPage[this.elementsPage.page.pageNumber] = false

    this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
    this.tableSelectedRows.push(...selected)
    return this.tableSelectedRows
  }

  selectAll(event) {
    if (!this.selectAllOnPage[this.elementsPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.elementsPage.data.map((bill) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(bill),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.elementsPage.data)
      this.selectAllOnPage[this.elementsPage.page.pageNumber] = true
    } else {
      // Unselect all
      this.elementsPage.data.map((bill) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(bill),
        )
      })
      this.selectAllOnPage[this.elementsPage.page.pageNumber] = false
    }
    //console.log('Select Event', selected, this.tableSelected);
  }
}
