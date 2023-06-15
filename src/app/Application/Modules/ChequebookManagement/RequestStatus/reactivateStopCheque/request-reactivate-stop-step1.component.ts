import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { RequestReactivateStopService } from './request-reactivate-stop.service'

@Component({
  selector: 'app-request-reactivate-stop-step1',
  templateUrl: './request-reactivate-stop-step1.component.html',
})
export class RequestReactivateStopStep1Component implements OnInit, OnDestroy {
  @Input() batch: any
  @Input() accounts: any
  @Output() onInit = new EventEmitter<Component>()

  constructor(public service: RequestReactivateStopService) {}

  ngOnInit() {
    // this.onInit.emit(this as Component);
  }

  ngOnDestroy() {}
}
