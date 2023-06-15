import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '../../../core/security/authentication.service'

@Component({
  templateUrl: './hajj-umrah-options.component.html',
})
export class HajjUmrahOptionsComponent implements OnInit {
  constructor(
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {}

  ngOnInit() {}

  goCardInquires() {
    this.router.navigate(['/hajjandumrahcards/cardinquires'])
  }

  goCardAllocationRequest() {
    this.router.navigate(['/hajjandumrahcards/cardallocationrequest'])
  }

  goCardOperation() {
    this.router.navigate(['/hajjandumrahcards/cardoperation'])
  }

  goCardRequestStatus() {
    this.router.navigate(['/hajjandumrahcards/reqStatus'])
  }

  goCardReports() {
    this.router.navigate(['/hajjandumrahcards/reports'])
  }
}
