import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Breadcrumb } from '../../../../../../shared/models/common';
import { DatatableMobileComponent } from '../../../../../../../../../core/responsive/datatable-mobile.component';
import { PagedData } from '../../../../../../../CommercialCards/ViewQueryCards/viewQueryCards.models';
import { Router } from '@angular/router';
import { FinanceFleetNewReqService } from '../../../../fleet-finance.service';

@Component({
  selector: 'arb-internal-summary',
  templateUrl: './internal-summary.component.html',
  styleUrls: ['./internal-summary.component.scss']
})
export class InternalSummaryComponent 
extends DatatableMobileComponent
implements OnInit 
 {
  subscriptions:Subscription[] =[];
  breadCrumb:Breadcrumb[] = [] ;
  internalPage: any;
  eligibleAmount:number = 0;
  internalQuotationList = [];

  constructor(public translate: TranslateService,
              public router: Router,
              private financeFleetService: FinanceFleetNewReqService

    ) { 
      super()
      this.internalPage = new PagedData<any>()
      this.internalPage.data = []
    }

  ngOnInit(): void {
    this.generateInternalQuotation(JSON.parse(sessionStorage.getItem("InQuotations"))['quotations'])
    this.internalPage.page.totalElements = this.internalPage.data.length;
    this.subscriptions.push(
      this.translate.get('fleet').subscribe((data:any)=>{
        this.breadCrumb = [
          { txt: data.newRequest.Finance, active: false },
          { txt: data.newRequest.NoteligibleTitle, active: true },
        ]
      })
    )
  }
  generateInternalQuotation(quotations:[]){
      quotations.forEach((quotation:any)=>{
        this.internalPage['data'].push({
          vehicleDescription: quotation.purposes[0].brandName,
          dealershipName: quotation.purposes[0].dealerName,
          pricePerVehicle: quotation.purposes[0].vehiclePrice,
          carQuantity: quotation.purposes[0].vehiclesNum,
          totalValue: quotation.purposes[0].purposeValue
        })
      })
  }
  goDetails(data,index){
    this.internalPage.data = this.internalPage.data.filter((data, idx) => idx !== index );
    let newInternal = JSON.parse(sessionStorage.getItem('InQuotations'))['quotations'].filter((data, idx) => idx !== index )
    sessionStorage.setItem("InQuotations",JSON.stringify({quotations:newInternal}));
  }
  navigateTo(){
    this.financeFleetService.setCurrentStep(3)
    this.router.navigate(['financeProduct/fleet/request/add-request'])
  }

}
