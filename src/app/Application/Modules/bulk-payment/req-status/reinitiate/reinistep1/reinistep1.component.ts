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
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { ReinitiateService } from '../reinitiate.service'

@Component({
  selector: 'app-reinistep1',
  templateUrl: './reinistep1.component.html',
  styleUrls: ['./reinistep1.component.scss'],
})
export class Reinistep1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('benfitable', { static: true }) table: any

  @Input() batch: any
  @Input() accounts: any
  @Input() form: FormGroup
  @Output() onInit = new EventEmitter<Component>()

  requestStatus: any = {}
  futureLevels = false

  constructor(
    private fb: FormBuilder,
    public reinitservice: ReinitiateService,
    public translate: TranslateService,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.onInit.emit(this as Component)
    this.requestStatus.batchPayrollsList = this.batch.fileLinesList
    //console.log(this.requestStatus.batchPayrollsList);
  }

  ngOnDestroy() {}

  valid(): boolean {
    return this.form.valid
  }

  public getTableCurrentPageSize(table) {
    if (table && table.bodyComponent && table.bodyComponent.temp) {
      return table.bodyComponent.temp.length
    }
    return 0
  }

  public getTranslationKey(prefix, key) {
    if (!prefix || prefix === null || prefix === undefined || prefix === '') {
      return key
    }
    return prefix + '.' + key
  }
}
