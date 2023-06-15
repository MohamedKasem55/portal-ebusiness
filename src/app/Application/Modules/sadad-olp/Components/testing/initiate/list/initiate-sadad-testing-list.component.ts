import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../../Common/Services/static.service'
import { InitiateSadadTestingListService } from './initiate-sadad-testing-list.service'

@Component({
  selector: 'app-initiate-testing-list',
  templateUrl: './initiate-sadad-testing-list.component.html',
  styleUrls: ['./initiate-sadad-testing-list.component.scss'],
})
export class InitiateSadadTestingListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  constructor(
    public fb: FormBuilder,
    public service: InitiateSadadTestingListService,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'refundID'
    this.orderType = 'desc'
  }

  getId(row) {
    return row['refundID']
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

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    selected.splice(0, selected.length)
    return this.tableSelectedRows
  }

  ngOnInit() {
    super.ngOnInit()
    this.search()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
  displayCheck(row) {
    return true
  }
}
