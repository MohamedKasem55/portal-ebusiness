import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { PageType } from '../../represented.service'


@Component({
  selector: 'accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent implements OnInit, OnDestroy {
  @Input() accounts: []
  @Input() disable: boolean = false
  @Input() pageType: PageType

  public footerHeight: any = 0
  public defaultHeight: any = 'auto'
  public isAllSelected: boolean = false
  public PageType = PageType

  constructor(
    public router: Router,
    public translate: TranslateService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnChanges() {
    this.draw()
  }

  ngOnInit(): void {
  }

  draw() {
    this.isAllSelected = true
    this.accounts.forEach((item: any) => {
      this.isAllSelected = this.isAllSelected && item.enabled
    })
  }

  selectAll(): void {
    this.isAllSelected = !this.isAllSelected
    this.accounts.forEach((item: any) => {
      item.enabled = this.isAllSelected
    })
  }

  onChangeAccount(row) {
    this.isAllSelected = true
    this.accounts.forEach((item: any) => {
      if (item.accountPk === row.accountPk) {
        item.enabled = !item.enabled
      }
      this.isAllSelected = this.isAllSelected && item.enabled
    })
  }

}
