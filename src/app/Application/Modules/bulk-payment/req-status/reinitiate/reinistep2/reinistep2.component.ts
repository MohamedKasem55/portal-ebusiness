import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { ReinitiateService } from '../reinitiate.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-reinistep2',
  templateUrl: './reinistep2.component.html',
  styleUrls: ['./reinistep2.component.scss'],
})
export class Reinistep2Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('authorization', { static: true }) authorization: any
  @ViewChild('table', { static: true }) table: any
  @Input() batch: any

  @Input() form: any
  @Input() accounts: any
  @Input() option: any
  @Input() DeleteOption: any
  @Input() InitiateOption: any
  @Input() generateChallengeAndOTP: ResponseGenerateChallenge
  @Input() requestValidate: RequestValidate
  @Output() onInit = new EventEmitter<Component>()

  requestStatus: any = {}

  constructor(
    private fb: FormBuilder,
    public reinitservice: ReinitiateService,
    public translate: TranslateService,
  ) {
    super()
  }

  valid(): boolean {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }

  ngOnInit() {
    this.requestStatus.batchPayrollsList = this.batch.fileLinesList
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}

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
