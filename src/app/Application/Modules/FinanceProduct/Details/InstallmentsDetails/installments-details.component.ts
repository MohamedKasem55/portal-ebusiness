import { Component, OnDestroy, OnInit, Input, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder } from '@angular/forms'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'installments-details',
  templateUrl: './installments-details.component.html',
  styleUrls: ['./installments-details.component.scss'],
})
export class InstallmentsDetails implements OnInit, OnDestroy {
  @Input() data: any
  @ViewChild('StatusTable', { static: true }) table: any

  public footerHeight: any = 0
  public defaultHeight: any = 'auto'

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private datePipe: DatePipe,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    const nameText = this.translate.instant('financeProduct.details.financeInstallment')
    this.data.forEach((row, index) => {

      row.name = nameText + ' ' + (index + 1).toString()
      row.currency = 'SAR'
      row.dueDate = this.datePipe.transform(new Date(row.dueDate.timestamp), 'dd/MM/yyyy')
      switch (row.status.toString().toUpperCase()) {
        case 'N':
          row.statusText = this.translate.instant('financeProduct.details.ins-status-n')
          break
        case 'I':
          row.statusText = this.translate.instant('financeProduct.details.ins-status-i')
          break
        case 'R':
          row.statusText = this.translate.instant('financeProduct.details.ins-status-r')
          break
        case 'C':
          row.statusText = this.translate.instant('financeProduct.details.ins-status-c')
          break
        case 'U':
          row.statusText = this.translate.instant('financeProduct.details.ins-status-u')
          break
        case 'P':
          row.statusText = this.translate.instant('financeProduct.details.ins-status-p')
          break
      }
    })
  }

}
