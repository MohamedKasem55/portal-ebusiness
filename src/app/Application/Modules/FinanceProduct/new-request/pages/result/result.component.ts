import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'

@Component({
  selector: 'result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
})
export class ResultComponent implements OnInit {
  @Input() img?: string
  @Input() title: string
  @Input() body: string
  @Input() status: string = 'default'
  breadCrumb: Breadcrumb[] = []
  constructor(private router: Router, public translate: TranslateService) {}

  ngOnInit(): void {
    this.translate.get('fleet').subscribe((data: any) => {
      this.breadCrumb = [
        { txt: data.newRequest.Finance, active: false },
        { txt: data.newRequest.NoteligibleTitle, active: true },
      ]
    })
  }
  navigateTo(pageRoute: string): void {
    this.router.navigate([`${pageRoute}`])
  }
}
