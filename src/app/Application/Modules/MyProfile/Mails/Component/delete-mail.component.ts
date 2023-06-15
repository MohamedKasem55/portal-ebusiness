import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { take } from 'rxjs/operators'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { Mail } from '../../../../Components/dashboard-layout/mail-model'
import { MailsService } from '../Services/mails.service'

@Component({
  selector: 'app-delete-mail',
  templateUrl: '../View/delete-mail.component.html',
})
export class DeleteMailComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('toDeleteTable', { static: true }) table: DatatableComponent
  @Input() mailsToDelete: Mail[]
  @Input() mailFolder: any
  @Output() onConfirmation = new EventEmitter<boolean>()
  @Output() onCancel = new EventEmitter<boolean>()

  constructor(private mailsService: MailsService) {
    super()
  }

  getAllTables(): any[] {
    return Array.of(this.table)
  }

  ngOnInit() {
    super.ngOnInit()
  }

  confirmDeletion() {
    this.mailsService
      .deleteMails(this.mailsToDelete, this.mailFolder)
      .pipe(take(1))
      .subscribe((result) => {
        this.onConfirmation.emit(true)
      })
  }
  cancelDeletion() {
    this.onCancel.emit(true)
  }
}
