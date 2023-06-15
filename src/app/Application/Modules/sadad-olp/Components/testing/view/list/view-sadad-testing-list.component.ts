import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../../Common/Services/static.service'
import { ManageTestingOLPEntityService } from '../details/view-sadad-testing-entity.service'
import { ViewSadadTestingListService } from './view-sadad-testing-list.service'

@Component({
  selector: 'app-view-testing-list',
  templateUrl: './view-sadad-testing-list.component.html',
  styleUrls: ['./view-sadad-testing-list.component.scss'],
})
export class ViewSadadTestingListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  constructor(
    public fb: FormBuilder,
    public service: ViewSadadTestingListService,
    public translate: TranslateService,
    public staticService: StaticService,
    public serviceData: ManageTestingOLPEntityService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'testRqId'
    this.orderType = 'desc'

    this.searchForm = this.fb.group({
      testRqId: [],
      status: [],
      startDate: [''],
      endDate: [''],
    })
  }

  getId(row) {
    return row['testRqId']
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

  getDetails(row: any) {
    this.serviceData.setSelectedData(row)
    this.router.navigate(['/sadadOLP/olp-view-testing'])
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
