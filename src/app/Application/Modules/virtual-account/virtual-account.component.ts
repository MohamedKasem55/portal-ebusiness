import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { VirtualAccountService } from './virtual-account.service'

@Component({
  selector: 'app-virtual-account',
  templateUrl: './virtual-account.component.html',
  styleUrls: ['./virtual-account.component.scss'],
})
export class VirtualAccountComponent implements OnInit {
  result
  getRequestStatusSubscription: Subscription
  requestStatus: any = {}

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: VirtualAccountService,
  ) {}

  ngOnInit() {
    this.setPage(null)
  }
  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.getRequestStatusSubscription = this.service.getData().subscribe(
      (result) => {
        if (result['errorCode'] !== '0') {
        } else {
          this.result = result['parameter']
          window.open(this.result, '_blank')
        }
      },
      (err) => {
        //console.log(err)
      },
    )
  }
}
