import {
  Component,
  EventEmitter, Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { Subscription } from 'rxjs'
import { EtradeService } from "../../../Services/workflow/etrade/etrade.service";
import { ColumnMode } from "@swimlane/ngx-datatable";
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-etrade-step2',
  templateUrl: './etrade-step2.component.html',
})
export class EtradeStep2Component extends DatatableMobileComponent implements OnInit, OnDestroy {
  // @ViewChild('changeValuesModal', { static: true })
  @ViewChild('table', { static: false }) table: any
  public changeValuesModal: ModalDirective
  @Output() onInit = new EventEmitter<Component>()
  @Input() companyDetails: any = null
  @Input() step: number = 0
  public defaultColumnMode = ColumnMode.force
  public footerHeight = window.innerWidth < 800 ? 150 : 74
  public defaultHeight: any = 'auto'
  messageError = {}
  subscriptions: Subscription[] = []

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public services: EtradeService,
    public translate: TranslateService,
  ) {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
    this.onInit.emit(this as Component)
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }
  onError(error: any) {
    const res = error
    this.messageError['code'] = res.error.errorCode
    this.messageError['description'] = res.error.errorDescription
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

}
