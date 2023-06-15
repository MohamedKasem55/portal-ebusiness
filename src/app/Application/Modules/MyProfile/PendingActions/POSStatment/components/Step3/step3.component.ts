import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  step = 3
  sharedData: any = {}

  constructor(private router: Router) {}

  ngOnInit(): void {}

  hasClaims() {
    return (
      this.sharedData.confirmAproveResponse &&
      this.sharedData.confirmAproveResponse.posClaimBatchList &&
      this.sharedData.confirmAproveResponse.posClaimBatchList.length > 0
    )
  }
  getTickets() {
    let ticketsNumber = ''
    if (
      this.sharedData.confirmAproveResponse &&
      this.sharedData.confirmAproveResponse.posClaimBatchList &&
      this.sharedData.confirmAproveResponse.posClaimBatchList.length > 0
    ) {
      ticketsNumber =
        ticketsNumber +
        this.sharedData.confirmAproveResponse.posClaimBatchList[0].ticketNumber
      for (
        let i = 1;
        i < this.sharedData.confirmAproveResponse.posClaimBatchList.length;
        ++i
      ) {
        ticketsNumber =
          ticketsNumber +
          ', ' +
          this.sharedData.confirmAproveResponse.posClaimBatchList[i]
            .ticketNumber
      }
    }
    return ticketsNumber
  }

  finish() {
    this.router.navigate(['/myprofile/pending/pos-statement/step1'])
  }
}
