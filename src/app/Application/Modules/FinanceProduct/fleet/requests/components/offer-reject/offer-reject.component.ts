import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'arb-offer-reject',
  templateUrl: './offer-reject.component.html',
  styleUrls: ['./offer-reject.component.scss']
})
export class OfferRejectComponent implements OnInit {
  dossairID:string = '1234567TRR'
  constructor() { }

  ngOnInit(): void {
  }

}
