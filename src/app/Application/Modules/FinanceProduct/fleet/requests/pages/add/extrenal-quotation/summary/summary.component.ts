import { Component, OnInit} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { FinanceFleetNewReqService } from '../../../../fleet-finance.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  constructor(public router: Router,
              public translate: TranslateService,
              private financeFleetNewReqService: FinanceFleetNewReqService
              ) {}
  quotationList: Array<any> = [];
  subscriptions:Subscription[] = []
  title1:string;
  title2:string;
  quotationIndex;
  breadCrumb: Breadcrumb[] = [];
  exQuotation:any;

  ngOnInit(): void {    
    this.quotationList = this.financeFleetNewReqService.getSelectedExternalQuotation();   
    this.quotationIndex = this.financeFleetNewReqService.QuotationIndex;
    this.exQuotation = JSON.parse(sessionStorage.getItem('ExQuotations'));
     
    this.subscriptions.push(
      this.translate.get('fleet').subscribe((data: any) => {
        this.title1 =  data.requests.externalQuotation;
        this.title2=data.requests.purposeUse
        this.breadCrumb = [
          { txt: data.newRequest.Finance, active: false },
          { txt: data.newRequest.NoteligibleTitle, active: true },
        ]
      })
    )

  }
  uploadCustomerQuotation(){
    if(sessionStorage.getItem('ExQuotations')){
      let NewQuotationArr:Array<any> = JSON.parse(sessionStorage.getItem('ExQuotations'));
      (this.quotationIndex!=null && this.quotationIndex >=0) ? NewQuotationArr[this.quotationIndex] = this.quotationList[0]:NewQuotationArr = NewQuotationArr.concat(this.quotationList)
      sessionStorage.setItem('ExQuotations',JSON.stringify(NewQuotationArr));
    }else{
      sessionStorage.setItem('ExQuotations',JSON.stringify(this.quotationList));
    }
    this.financeFleetNewReqService.setExternalQuotation(null);
    this.financeFleetNewReqService.QuotationIndex = null;
    this.navigateTo();
  }
  navigateTo() {
    this.financeFleetNewReqService.setCurrentStep(3);
    this.router.navigate(['financeProduct/fleet/request/add-request'])
  }
  ngOnDestory(){
    this.subscriptions.forEach(element=>{
      element.unsubscribe()
    })
  }
}


