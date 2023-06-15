import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from '../../../../../shared/models/common';
import {FinanceFleetNewReqService} from "../../../fleet-finance.service";
import {Router} from "@angular/router";

@Component({
  selector: 'finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss'],
})
export class FinishComponent implements OnInit {
  breadCrumb: Breadcrumb[] = [];
  dossairID:string = ''
  constructor(public translate: TranslateService,  private fleetServiceReq: FinanceFleetNewReqService, public router: Router,) {}

  ngOnInit(): void {
    this.dossairID = sessionStorage.getItem('dossairID')
    this.translate.get('fleet').subscribe((data:any)=>{
      this.breadCrumb = [
        { txt: data.newRequest.Finance, active: false },
        { txt: data.newRequest.NoteligibleTitle, active: true },
      ]
    })

  }
  goDashboard(){
    this.router.navigate(['/']).then(() => {
      this.fleetServiceReq.removeFleetSessionCache();
    })
  }
  goDetailScreen(){
    this.router.navigate(['/financeProduct/details']).then(() => {
      this.fleetServiceReq.removeFleetSessionCache();
    })
  }
}
