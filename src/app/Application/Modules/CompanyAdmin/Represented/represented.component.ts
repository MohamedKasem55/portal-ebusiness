import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PageType, RepresentedService } from './represented.service'
import { StorageService } from '../../../../core/storage/storage.service'


@Component({
  selector: 'represented',
  templateUrl: './represented.component.html',
  styleUrls: ['./represented.component.scss'],
})
export class RepresentedComponent
  implements OnInit, OnDestroy {

  public showNoData: boolean = false
  public repList: any = []
  public footerHeight: any = 0
  public defaultHeight: any = 'auto'
  public isAllSelected: boolean = false
  public isItemSelected: boolean = false
  public isSearchCollapsed: boolean = true
  public repType = 'ALL'
  public showDelete = false

  constructor(
    public router: Router,
    public representedService: RepresentedService,
    public storage: StorageService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.getList()
  }

  getList() {
    this.isAllSelected = false
    this.isItemSelected = false
    this.representedService.getRepList(this.repType).subscribe((result) => {
      this.repList = []
      if (result !== null) {
        this.repList = result
        if (this.repList.length == 0) {
          this.showNoData = true
        }
        this.repList.forEach((item: any) => {
          item.enabled = false
        })
      }
    })
  }

  resetValues() {
    this.repType = 'ALL'
    this.getList()
  }

  selectAll(): void {
    this.isAllSelected = !this.isAllSelected
    this.repList.forEach((item: any) => {
      item.enabled = this.isAllSelected
    })
  }

  onChangeRow(row) {
    this.isItemSelected = false
    this.isAllSelected = true
    this.repList.forEach((item: any) => {
      if (item.repID === row.repID) {
        item.enabled = !item.enabled
      }
      this.isItemSelected = this.isItemSelected || item.enabled
      this.isAllSelected = this.isAllSelected && item.enabled
    })
  }

  onChangeRepType() {
    this.getList()
  }

  addNew(): void {
    this.storage.store('RepresentedDetails', { type: PageType.ADD, data: {} })
    this.router.navigate(['/companyadmin/represented/details']).then(() => {
    })
  }

  showDetails(row): void {
    this.storage.store('RepresentedDetails', { type: PageType.VIEW, data: row.repID })
    this.router.navigate(['/companyadmin/represented/details']).then(() => {
    })
  }

  delete() {
    this.showDelete = true
  }

  deleteAction(flag) {
    this.showDelete = false
    let data = []
    this.repList.forEach((item: any) => {
      if (item.enabled) {
        data.push({
          'repAuthId': item.repID,
          'repDelReason': 'Delete',
        })
      }
    })
    if (flag) {
      this.representedService.deleteRep(data).subscribe((result) => {
        if (result !== null) {
          this.getList()
        }
      })
    }
  }
}
