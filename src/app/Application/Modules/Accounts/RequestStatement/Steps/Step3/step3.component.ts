import { Component, OnDestroy, OnInit, Input } from '@angular/core'

@Component({
  selector: 'app-request-statement-step3',
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit, OnDestroy {
  @Input() fileName: any
  construct() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
