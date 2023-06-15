import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'

@Component({
  selector: 'app-feedback-files-detail-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component extends DatatableMobileComponent implements OnInit {
  @Input() fileDetail
  @Input() fileSelected
  @Output() onInit = new EventEmitter()
  constructor(public router: Router, public translate: TranslateService) {
    super()
  }

  ngOnInit() {
    this.onInit.emit(this as Component)
  }
}
