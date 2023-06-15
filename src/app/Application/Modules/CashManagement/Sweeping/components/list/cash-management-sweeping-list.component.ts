import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { interval } from 'rxjs'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { CashManagementSweepingDetailService } from '../detail/cash-management-sweeping-detail.service'
import { CashManagementSweepingListService } from './cash-management-sweeping-list.service'

@UntilDestroy()
@Component({
  templateUrl: './cash-management-sweeping-list.component.html',
  styleUrls: ['./cash-management-sweeping-list.component.scss'],
})
export class CashManagementSweepingListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  constructor(
    public fb: FormBuilder,
    public service: CashManagementSweepingListService,
    public serviceDetail: CashManagementSweepingDetailService,
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
    this.router.navigate(['/cashManagement/sweeping/detail'])
  }

  onCreateStructure() {
    this.serviceDetail.setStructure({
      structureId: null,
    })
    this.router.navigate(['/cashManagement/sweeping/detail'])
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
