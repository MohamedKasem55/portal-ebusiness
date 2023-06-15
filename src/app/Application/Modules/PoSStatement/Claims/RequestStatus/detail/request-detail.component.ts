import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { ClaimService } from '../../claim.service'

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit, OnDestroy {
  urlFinish = ['/posstatement/claims']

  subscriptions: Subscription[] = []
  mensajeError: any = {}

  comboTerminal: any
  terminals: any
  element: any

  constructor(
    private router: Router,
    public translate: TranslateService,
    public storage: StorageService,
    public serviceManage: ClaimService,
  ) {}

  ngOnInit() {
    this.element = this.serviceManage.getDataElement()
    this.subscriptions.push(
      this.serviceManage.getTerminals().subscribe((result) => {
        this.terminals = result.accountListDTO
        this.comboTerminal = this.extractTerminalKeyValue(this.terminals)
      }),
    )
  }

  extractTerminalKeyValue(account: any) {
    const terminalKeyValue = []
    for (let i = 0; account.length > i; i++) {
      terminalKeyValue.push({ key: i, value: account[i] })
    }
    return terminalKeyValue
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  goCancel() {
    this.router.navigate(this.urlFinish)
  }
}
