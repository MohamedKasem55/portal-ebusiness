import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Breadcrumb } from '../../../../../shared/models/common';

@Component({
  selector: 'arb-track-status',
  templateUrl: './track-status.component.html',
  styleUrls: ['./track-status.component.scss']
})
export class TrackStatusComponent implements OnInit {
  breadCrumb: Breadcrumb[] = []
  constructor(public translate: TranslateService) { }

  ngOnInit(): void {
    this.translate.get('fleet').subscribe((data:any)=>{
      this.breadCrumb = [
        { txt: data.newRequest.Finance, active: false },
        { txt: data.requests.currentFinance, active: true },
      ]
    })
  }

}
