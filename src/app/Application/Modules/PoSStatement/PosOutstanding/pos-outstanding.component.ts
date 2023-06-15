import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { PoSStatementService } from '../pos-statement.service'

@Component({
  templateUrl: './pos-outstanding.component.html',
})
export class ListPoSOutstandingsComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: PoSStatementService,
  ) {}

  ngOnInit() {
    this.service.outStandingdownload().subscribe((response) => {
      const downloadUrl = URL.createObjectURL(response)
      const link = document.createElement('a')
      link.download = 'POS_outstanding.csv'
      link.href = downloadUrl
      document.body.appendChild(link)
      link.click()
    })
  }
}
