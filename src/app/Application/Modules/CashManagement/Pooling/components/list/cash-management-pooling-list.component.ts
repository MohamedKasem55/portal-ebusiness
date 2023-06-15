import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { interval } from 'rxjs'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { CashManagementPoolingDetailService } from '../detail/cash-management-pooling-detail.service'
import { CashManagementPoolingListService } from './cash-management-pooling-list.service'
@UntilDestroy()
@Component({
  templateUrl: './cash-management-pooling-list.component.html',
  styleUrls: ['./cash-management-pooling-list.component.scss'],
})
export class CashManagementPoolingListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  constructor(
    public fb: FormBuilder,
    public service: CashManagementPoolingListService,
    public serviceDetail: CashManagementPoolingDetailService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'structureId'
    this.orderType = 'desc'

    this.searchForm = this.fb.group({})
  }

  ngOnInit() {
    super.ngOnInit()
    interval(1000).pipe(untilDestroyed(this)).subscribe()

    this.search()
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

  goDetails(item) {
    this.serviceDetail.setStructure(item)
    this.router.navigate(['/cashManagement/pooling/detail'])
  }

  onCreateStructure() {
    this.serviceDetail.setStructure({
      structureId: null,
    })
    this.router.navigate(['/cashManagement/pooling/detail'])
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getId(row) {
    return row['structureId']
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
}
