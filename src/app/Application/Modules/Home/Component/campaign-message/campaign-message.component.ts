import { Component, Input, OnInit, OnChanges } from '@angular/core'
import { MessageModel } from 'app/core/security/login-rev/models/message.model'
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-messages',
  templateUrl: './campaign-message.component.html',
  styleUrls: ['./campaign-message.component.scss'],
})
export class CampaignMessageComponent implements OnInit, OnChanges {
  @Input()
  public messages: MessageModel[]
  alertInfo = true
  constructor(public translate: TranslateService) {}

  ngOnInit() {}

  onClosed(dismissedAlert: any): void {
    this.messages = this.messages.filter(
      (messages) => messages !== dismissedAlert,
    )
    this.alertInfo = false
  }

  ngOnChanges() {}
}
