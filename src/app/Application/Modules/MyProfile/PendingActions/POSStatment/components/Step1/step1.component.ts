import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { POSStatementService } from '../../pos-statement.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  step = 1
  sharedData: any = {}

  newRequestSubscription: Subscription
  tableNewRequestLimit = 20
  listNewRequest: any = {}

  posManagementSubscription: Subscription
  tablePOSManagementLimit = 20
  listPOSManagement: any = {}

  posMaintenanceSubscription: Subscription
  tablePOSMaintenanceLimit = 20
  listPOSMaintenance: any = {}

  claimSubscription: Subscription
  tableClaimLimit = 20
  listClaim: any = {}

  constructor(
    private service: POSStatementService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit(): void {
    this.listNewRequest.items = []
    this.listNewRequest.size = 0
    this.listNewRequest.total = 0
    this.sharedData.newRequestSelected = []
    this.setPageNewRequest(null)

    this.listPOSManagement.items = []
    this.listPOSManagement.size = 0
    this.listPOSManagement.total = 0
    this.sharedData.posManagementSelected = []
    this.setPagePOSManagement(null)

    this.listPOSMaintenance.items = []
    this.listPOSMaintenance.size = 0
    this.listPOSMaintenance.total = 0
    this.sharedData.posMaintenanceSelected = []
    this.setPagePOSMaintenance(null)

    this.listClaim.items = []
    this.listClaim.size = 0
    this.listClaim.total = 0
    this.sharedData.claimSelected = []
    this.setPageClaim(null)

    this.sharedData.responseValidate = {}
  }

  setPageNewRequest(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.newRequestSubscription = this.service
      .newRequestGetList(pageInfo.offset + 1, this.tableNewRequestLimit)
      .subscribe((result) => {
        this.newRequestSubscription.unsubscribe()
        if (!result.error) {
          this.listNewRequest = result.posRequestBatchList
        }
      })
  }

  setPagePOSManagement(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.posManagementSubscription = this.service
      .posManagementGetList(pageInfo.offset + 1, this.tablePOSManagementLimit)
      .subscribe((result) => {
        this.posManagementSubscription.unsubscribe()
        if (!result.error) {
          this.listPOSManagement = result.posManagementBatchList
        }
      })
  }

  setPagePOSMaintenance(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.posMaintenanceSubscription = this.service
      .posMaintenanceGetList(pageInfo.offset + 1, this.tablePOSMaintenanceLimit)
      .subscribe((result) => {
        this.posMaintenanceSubscription.unsubscribe()
        if (!result.error) {
          this.listPOSMaintenance = result.posMaintenanceBatchList
        }
      })
  }

  setPageClaim(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.claimSubscription = this.service
      .claimGetList(pageInfo.offset + 1, this.tableClaimLimit)
      .subscribe((result) => {
        this.claimSubscription.unsubscribe()
        if (!result.error) {
          this.listClaim = result.posClaimBatchList
        }
      })
  }

  cleanSelectionTableNewRequest() {
    this.sharedData.newRequestSelected.splice(
      0,
      this.sharedData.newRequestSelected.length,
    )
    const items = Object.assign([], this.listNewRequest.items)
    this.listNewRequest.items = []
    this.listNewRequest.items.push(...items)
  }

  cleanSelectionTablePOSManagement() {
    this.sharedData.posManagementSelected.splice(
      0,
      this.sharedData.posManagementSelected.length,
    )
    const items = Object.assign([], this.listPOSManagement.items)
    this.listPOSManagement.items = []
    this.listPOSManagement.items.push(...items)
  }

  cleanSelectionTablePOSMaintenance() {
    this.sharedData.posMaintenanceSelected.splice(
      0,
      this.sharedData.posMaintenanceSelected.length,
    )
    const items = Object.assign([], this.listPOSMaintenance.items)
    this.listPOSMaintenance.items = []
    this.listPOSMaintenance.items.push(...items)
  }

  cleanSelectionTableClaim() {
    this.sharedData.claimSelected.splice(
      0,
      this.sharedData.claimSelected.length,
    )
    const items = Object.assign([], this.listClaim.items)
    this.listClaim.items = []
    this.listClaim.items.push(...items)
  }

  onSelectNewRequest({ selected }) {
    this.sharedData.newRequestSelected.splice(
      0,
      this.sharedData.newRequestSelected.length,
    )
    this.sharedData.newRequestSelected.push(...selected)
  }
  onSelectPOSManagement({ selected }) {
    this.sharedData.posManagementSelected.splice(
      0,
      this.sharedData.posManagementSelected.length,
    )
    this.sharedData.posManagementSelected.push(...selected)
  }
  onSelectPOSMaintenance({ selected }) {
    this.sharedData.posMaintenanceSelected.splice(
      0,
      this.sharedData.posMaintenanceSelected.length,
    )
    this.sharedData.posMaintenanceSelected.push(...selected)
  }
  onSelectClaim({ selected }) {
    this.sharedData.claimSelected.splice(
      0,
      this.sharedData.claimSelected.length,
    )
    this.sharedData.claimSelected.push(...selected)
  }

  checkSelectNewRequest(event) {
    return this['selected'].indexOf(event) === -1
  }

  checkSelectPOSMaintenance(event) {
    return this['selected'].indexOf(event) === -1
  }
  checkSelectPOSManagement(event) {
    return this['selected'].indexOf(event) === -1
  }
  checkSelectClaim(event) {
    return this['selected'].indexOf(event) === -1
  }

  changeDisplaySizeNewRequest(event) {
    this.tableNewRequestLimit = event
    this.setPageNewRequest(null)
  }

  changeDisplaySizePOSMaintenance(event) {
    this.tablePOSMaintenanceLimit = event
    this.setPagePOSMaintenance(null)
  }

  changeDisplaySizePOSManagement(event) {
    this.tablePOSManagementLimit = event
    this.setPagePOSManagement(null)
  }

  changeDisplaySizeClaim(event) {
    this.tableClaimLimit = event
    this.setPageClaim(null)
  }
}
