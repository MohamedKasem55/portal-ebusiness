import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { DepositorOriginator } from '../../Model/depositor-originator'
import { BeneficiaryOriginatorService } from '../../Services/beneficiary-originator/beneficiary-originator.service'

@Component({
  selector: 'app-confirm-changes',
  templateUrl:
    '../../View/beneficiary-originator/confirm-changes.component.html',
})
export class ConfirmChangesComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table') table: DatatableComponent
  modifyBeneficiaries: DepositorOriginator[] = []
  wizardStep = 1

  constructor(
    public translate: TranslateService,
    private beneficiaryOriginatorService: BeneficiaryOriginatorService,
    private router: Router,
  ) {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
    this.modifyBeneficiaries =
      this.beneficiaryOriginatorService.pullModifiedBeneficiaries()
  }

  getAllTables(): any[] {
    return Array.of(this.table)
  }

  navToListView() {
    this.router.navigate(['/companyadmin/accounts/beneficiary-originators'])
  }

  confirm() {
    const array = this.modifyBeneficiaries.map((value) => {
      // value.checked = true
      value.modify = true
      return value
    })
    this.beneficiaryOriginatorService
      .confirmDepositorList(array)
      .subscribe((response) => {
        if (response.errorCode !== '-1') {
          this.wizardStep = 2
        }
      })
  }
}
