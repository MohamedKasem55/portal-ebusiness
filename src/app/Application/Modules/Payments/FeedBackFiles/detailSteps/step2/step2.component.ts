import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FeedBackFilesService } from '../../feedback-files-list.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-feedback-files-detail-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {
  @Input() fileSelected
  @Output() onInit = new EventEmitter()

  constructor(
    private feedBackService: FeedBackFilesService,
    public router: Router,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
  }
}
