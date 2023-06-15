import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BsModalRef } from 'ngx-bootstrap/modal'

@Component({
  selector: 'app-simple-modal',
  templateUrl: './simple-modal.component.html',
  styleUrls: ['./simple-modal.component.scss'],
})
export class SimpleModalComponent implements OnInit {
  public title: string
  public body: string

  constructor(
    private bsModalRef: BsModalRef,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.bsModalRef.hide()
  }
}
