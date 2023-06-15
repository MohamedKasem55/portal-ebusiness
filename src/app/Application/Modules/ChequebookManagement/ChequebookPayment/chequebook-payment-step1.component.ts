import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { ChequebookPaymentService } from './chequebook-payment.service'

@Component({
  selector: 'app-step1',
  templateUrl: './chequebook-payment-step1.component.html',
  styleUrls: ['./chequebook-payment.component.scss'],
})
export class ChequebookPaymentStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: any
  @Input() form: FormGroup
  @Output() onInit = new EventEmitter<Component>()

  chequeBooks: any
  tableDisplaySize = 10
  requestStatus: any
  selectedAccount: any
  accounts: any[] = []
  status: any[] = []

  tableSelected: any[] = []

  isSearchCollapsed = true

  constructor(
    public translate: TranslateService,
    private fb: FormBuilder,
    public service: ChequebookPaymentService,
  ) {
    super()
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }
  searchFilterSubmit() {
    this.setPage(null)
  }

  reset() {
    this.form.reset()
    this.searchFilterSubmit()
  }

  ngOnInit() {
    super.ngOnInit()
    this.onInit.emit(this as Component)
  }

  onSelect({ selected }) {
    ////console.log('Select Event', selected, this.tableSelectedRows);
    this.tableSelected.splice(0, this.tableSelected.length)
    this.tableSelected.push(...selected)
  }

  ngOnDestroy() {}
}
