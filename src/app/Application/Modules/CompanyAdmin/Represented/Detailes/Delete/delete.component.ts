import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core'
import { ModalDirective } from 'ngx-bootstrap/modal'


@Component({
  selector: 'represented-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})

export class RepresentedDeleteComponent
  implements OnInit, OnDestroy {

  @Input() show: boolean
  @Output() deleteAction = new EventEmitter<any>()
  @ViewChild('DeleteConfirm') public deleteConfirmModal: ModalDirective

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.deleteConfirmModal) {
      this.show ? this.deleteConfirmModal.show() : this.deleteConfirmModal.hide()
    }
  }

  public closeModal(flag) {
    this.deleteAction.emit(flag)
  }

}
