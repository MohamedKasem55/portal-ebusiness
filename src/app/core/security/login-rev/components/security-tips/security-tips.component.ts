import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { MessageModel } from '../../models/message.model'
import { TranslateService } from '@ngx-translate/core'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-security-tips',
  templateUrl: './security-tips.component.html',
  styleUrls: ['./security-tips.component.scss'],
})
export class SecurityTipsComponent implements OnInit, OnChanges {
  @Input()
  public messages: MessageModel[]
  public message: string
  public hasMessageExternal = false
  public showContent = false
  constructor(
    public translate: TranslateService,
    public _sanitizer: DomSanitizer,
  ) {
    this.messages = []
  }

  ngOnInit() {
    if (localStorage.getItem('typeUrl') == 'publicsector') {
      this.message = 'login.resources.securityTipsInfoGov'
    } else {
      this.message = 'login.resources.securityTipsInfo'
    }
  }
  ngOnChanges() {}
  getSanitizedUnescapedStr(str) {
    const txt = document.createElement('textarea')
    txt.innerHTML = unescape(str)
    return this._sanitizer.bypassSecurityTrustHtml(txt.value)
  }
}
