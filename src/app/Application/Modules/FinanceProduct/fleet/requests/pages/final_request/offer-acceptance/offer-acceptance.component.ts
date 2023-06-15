import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { FinanceFleetNewReqService } from '../../../fleet-finance.service'
import { Pill } from 'app/Application/Modules/FinanceProduct/shared/models/common'

@Component({
  selector: 'offer-acceptance',
  templateUrl: './offer-acceptance.component.html',
  styleUrls: ['./offer-acceptance.component.scss'],
})
export class OfferAcceptanceComponent implements OnInit {


  breadCrumbList:Breadcrumb[]=[]  
  docRef:string=""
  pillData:Pill={txt: this.translate.instant('fleet.bills.attentionNeed'), status: 'warning' }
  constructor(
    private fleetService:FinanceFleetNewReqService,
    private translate:TranslateService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.prepareData()
  }

  // prepare data for wizzard 
  prepareData(){
    this.translate.get('fleet').subscribe(data=>{
    this.prepareBreadCrump(data)
    })
  }
  navigateTo(navUrl){
    
this.router.navigate([navUrl])
  }

  prepareBreadCrump(data: any): void {
    this.breadCrumbList=[
      {
        txt:data.offerAcceptance.finance,
        active:false,
        router:''
      },
      {
        txt:data.offerAcceptance.fleetFinance,
        active:false,
        router:''
      },
      {
        txt:data.offerAcceptance.contractDetails,
        active:true,
        router:''
      },
    ]
  }

 
}
