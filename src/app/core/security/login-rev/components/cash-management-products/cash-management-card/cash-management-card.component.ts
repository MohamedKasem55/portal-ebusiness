import {Component, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Component({
  selector: 'arb-cash-management-card',
  templateUrl: './cash-management-card.component.html',
  styleUrls: ['./cash-management-card.component.scss']
})
export class CashManagementCardComponent implements OnInit {

  constructor(
      public translate: TranslateService,
      public router: Router
  ) {
  }

  ngOnInit() {

  }

  routeToCashManagementProducts(){
    this.router.navigateByUrl('/cash-management-products')
  }
}
