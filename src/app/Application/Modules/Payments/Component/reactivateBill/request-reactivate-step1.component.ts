import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, NgForm } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { RequestBillReactivateBillService } from './request-reactivate.service'

@Component({
  selector: 'app-bill-request-reactivate-bill-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestBillReactivateBillStep1Component
  implements OnInit, OnDestroy
{
  @Input() batch: any
  @Output() onInit = new EventEmitter<Component>()
  @Input() sharedData: any
  @ViewChild('form') public form: NgForm

  employeePageSize = 10
  paymentDate: any

  bsConfig: any

  constructor(
    private fb: FormBuilder,
    public service: RequestBillReactivateBillService,
    public translate: TranslateService,
  ) {}

  ngOnInit() {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.findCodeSelected(this.batch.billCode)
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}

  findCodeSelected(code) {
    for (let i = this.sharedData.billCodes.length - 1; i >= 0; i--) {
      if (this.sharedData.billCodes[i].billCode == code) {
        this.sharedData.selected = this.sharedData.billCodes[i]
        this.sharedData.selectedBill = this.sharedData.billCodes[i]
        this.searchByGroup(this.sharedData.billCodes[i])
      }
    }
  }

  searchByGroup(group) {
    if (group) {
      this.sharedData.group = this.sharedData.billCodes.filter(
        (bill) => bill['categoryEn'] === group['categoryEn'],
      )
      /*if(this.wizardData.unityServiceProvider){
                this.wizardData.unityServiceProvider = null;
            }*/
    } else {
      this.sharedData.group = []
      /*this.wizardData.unityServiceProvider = null;*/
    }
  }

  isValid() {
    return this.form.valid || this.batch.paymentType != 'partial'
  }
}
