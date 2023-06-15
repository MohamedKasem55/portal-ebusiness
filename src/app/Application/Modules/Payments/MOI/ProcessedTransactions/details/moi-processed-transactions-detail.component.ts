import { Component, Inject, Injector, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MoiProcessedTransactionsDetailService } from './moi-processed-transactions-detail.service';
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../../../../../../core/security/authentication.service";
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { Router } from '@angular/router';
import { ColumnMode, SelectionType } from '@swimlane/ngx-datatable';
import { AmountCurrencyPipe } from 'app/Application/Components/common/Pipes/amount-currency.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-moi-processed-transactions-detail',
  templateUrl: './moi-processed-transactions-detail.component.html'
})
export class MoiProcessedTransactionsDetailComponent implements OnInit {

  public defaultColumnMode = ColumnMode.force
  public defaultSelectionType = SelectionType.checkbox
  public defaultSelectionTypeSingle = SelectionType.single
  public defaultSelectionTypeCell = SelectionType.cell
  public visiblePagesCount = 5 // Modify the value to show more or less page numbers
  public footerHeight = 70
  public defaultHeight: any = 'auto'
  public defaultWidth: any = 'auto'
  public tablePageSize = 20

  combosKeys: any[] = [];
  // ['eGovSadadVisaDuration','eGovSadadJobCategory']
  combosData: any = {}
  subscriptions: Subscription[] = []

  entityPropertiesMoiProcessTransactions: any[]
  moiProcessTransactionsForm: FormGroup
  selectedItem: any
  totalAmountsFee: string


  constructor(
    public fb: FormBuilder,
    public detailsService: MoiProcessedTransactionsDetailService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string

  ) {
    this.moiProcessTransactionsForm = fb.group({})
    this.entityPropertiesMoiProcessTransactions = []
  }

  ngOnInit(): void {
    this.selectedItem = this.detailsService.getSelectedItem()
    this.selectedItem.details.forEach(detail => {
      if (detail.list) {
        this.combosKeys.push(detail.list);
      }
    })
    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(this.combosKeys)
        .subscribe((resultC) => {
          const data: any = resultC
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.combosKeys.length; i++) {
            this.combosData[this.combosKeys[i]] = data[this.combosKeys[i]]
          }
          // -------------------------------------------------
          this.entityPropertiesMoiProcessTransactions = this.detailsService.getFieldEntityPropertiesMoiProcessTransactions(this.combosData)
          this.moiProcessTransactionsForm = this.fb.group({})

          //Calculate total values from fees
          if (this.selectedItem?.fees && this.selectedItem?.fees.length > 0) {
            this.totalAmountsFee = new AmountCurrencyPipe(this.injector, this.locale).transform(
              this.selectedItem.fees ? this.detailsService.getTotalAmount(this.selectedItem.fees) : 0,
              null,
            )
          }

          if (!this.selectedItem) {
            this.router.navigate(['/payments/moi/processedTransactions'])
          }
        }),

    )



  }

  getId(row) {
    return row[this.getIdFieldName()]
  }
  getIdFieldName() {
    return 'batchId'
  }
  getBackUrl() {
    return '/payments/moi/processedTransactions'
  }

  public getExportColumns() {
    return [
      { title: this.translate.instant('feesType',), dataKey: 'feesType', },
      { title: this.translate.instant('payments.hajjumrahcards.cardOperation.feesAmount',), dataKey: 'feesAmount', },
    ]
  }


}
