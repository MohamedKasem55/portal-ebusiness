import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'arb-initial-offer-approved',
  templateUrl: './initial-offer-approved.component.html',
  styleUrls: ['./initial-offer-approved.component.scss']
})
export class InitialOfferApprovedComponent implements OnInit {
  finalOfferInfo = {
    productName: "Fleet Finance",
    financeAmount: 30000000,
    dossairID:"1234567TRR"
  }
  constructor(public modalRef: BsModalRef,
              public router: Router
    ) { }

  ngOnInit(): void {
  }
  navigateTo(){
    this.modalRef.hide();
    this.router.navigate(['/financeProduct/fleet/request/final-offer']);
  }
}
