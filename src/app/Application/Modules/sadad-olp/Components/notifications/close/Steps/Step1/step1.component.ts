import {
  Component,
  OnInit,
  Output,
  OnDestroy,
  Input,
  EventEmitter,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { TranslateService } from '@ngx-translate/core'
import { ManageOLPNotificationEntityService } from '../../../olp-notifications-entity.service'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'
import { StaticService } from '../../../../../../Common/Services/static.service'

@Component({
  selector: 'app-close-notifications-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @Output() onInit = new EventEmitter<Component>()
  @Input() title: string

  subscriptions: Subscription[] = []

  constructor(
    public translate: TranslateService,
    public staticService: StaticService,
    private serviceData: ManageOLPNotificationEntityService,
  ) {
    super()
  }

  ngOnInit() {
    this.onInit.emit(this as Component)
    super.ngOnInit()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
