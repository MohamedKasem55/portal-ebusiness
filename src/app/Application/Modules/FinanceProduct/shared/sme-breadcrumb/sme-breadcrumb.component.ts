import { Component, OnInit, Input } from '@angular/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'sme-breadcrumb',
  templateUrl: './sme-breadcrumb.component.html',
  styleUrls: ['./sme-breadcrumb.component.scss'],
})
export class SmeBreadcrumbComponent implements OnInit {
  @Input() list: Breadcrumb[] = []
  constructor(public translate: TranslateService,) {}

  ngOnInit(): void {}
}
