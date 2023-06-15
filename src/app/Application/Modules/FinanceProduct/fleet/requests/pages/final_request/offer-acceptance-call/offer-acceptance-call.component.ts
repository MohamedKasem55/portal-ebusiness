import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common';
import { FinanceFleetNewReqService } from '../../../fleet-finance.service';
@Component({
  selector: 'arb-offer-acceptance-call',
  templateUrl: './offer-acceptance-call.component.html',
  styleUrls: ['./offer-acceptance-call.component.scss']
})
export class OfferAcceptanceCallComponent implements OnInit {
  breadCrumbList: Breadcrumb[] = []
   minute:number=0
   second:number=60
   isrecallBtnDisabled=true
  constructor(
    private translate: TranslateService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.prepareData()
    this.startTime()
  }
   // prepare page data
   prepareData(): void {
    this.translate.get('fleet').subscribe((data) => {
      this.prepareBreadCrump(data)
    })
  }

  // set BreadCrump data
  prepareBreadCrump(data: any): void {
    this.breadCrumbList = [
      { txt: data.offerAcceptance.finance, active: false, router: '' },
      { txt: data.offerAcceptance.fleetFinance, active: true, router: '' },
      { txt: data.offerAccepanceCall.contactDetails, active: true, router: '' },
    ]
  }
  navigateTo(navUrl):void{
    this.router.navigate([navUrl])
  }


  startTime(){
   this.decrementMinute()
   this.decrementSecond()
  }

  decrementMinute(){
   let minInter= setInterval(()=>{
     if(this.minute<=0)
     {
     clearInterval(minInter)
     }
     else{
      --this.minute
      this.second=60
     }
    },60000 )
  }
  decrementSecond(){
   let secInt= setInterval(()=>{
     if(this.minute==0 && this.second==0){
      clearInterval(secInt)
     this.navigteToAction()
      
     }else{
      --this.second
     }
     },1000)
  }
  
  navigteToAction(){
    this.isrecallBtnDisabled=false
  }
}
