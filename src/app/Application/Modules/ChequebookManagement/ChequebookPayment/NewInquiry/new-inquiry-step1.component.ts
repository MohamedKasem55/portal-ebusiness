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
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { NewInquiryService } from './new-inquiry.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-new-inquiry-step1',
  templateUrl: './new-inquiry-step1.component.html',
})
export class NewInquiryStep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: any
  @Input() form: FormGroup
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  inquiriesResult: any
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
    public service: NewInquiryService,
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

  onSelect({ selected }) {
    //console.log('Select Event', selected, this.tableSelectedRows);
    this.tableSelected.splice(0, this.tableSelected.length)
    this.tableSelected.push(...selected)
  }

  ngOnInit() {
    super.ngOnInit()
    // this.onInit.emit(this as Component);
  }

  ngOnDestroy() {}
}
