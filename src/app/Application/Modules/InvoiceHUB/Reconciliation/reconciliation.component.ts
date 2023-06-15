import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ReconciliationService } from './reconciliation.service'

@Component({
  selector: 'app-reconciliation',
  templateUrl: './reconciliation.component.html',
  styleUrls: ['./reconciliation.component.scss'],
})
export class ReconciliationComponent implements OnInit {
  constructor(
    private service: ReconciliationService,
    public translate: TranslateService,
    public router: Router,
  ) {}

  ngOnInit(): void {}
}
