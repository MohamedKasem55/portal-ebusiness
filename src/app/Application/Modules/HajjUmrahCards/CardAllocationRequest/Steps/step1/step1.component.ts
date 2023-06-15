import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { HijraDateFormatPipe } from '../../../../../Components/common/Pipes/hijra-date-format-pipe'

@Component({
  selector: 'app-request-cards-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit {
  @Input() form: FormGroup
  @Input() batch: any
  @Output() onInit = new EventEmitter<Component>()
  bsConfig: any
  subscriptions: Subscription[] = []

  constructor(private injector: Injector, public translate: TranslateService) {}

  ngOnInit() {
    const hijra = new HijraDateFormatPipe(this.injector)
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.subscriptions.push(
      this.form.controls['visaDate'].valueChanges.subscribe((values) => {
        this.form.controls['hijraDateCard'].setValue(
          hijra.transform(values, 'dd/MM/yyyy'),
        )
      }),
    )
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((res) => {
        this.form.controls['hijraDateCard'].setValue(
          hijra.transform(this.form.controls['visaDate'].value, 'dd/MM/yyyy'),
        )
      }),
    )
    this.onInit.emit(this as Component)
  }

  /*ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }*/
}
