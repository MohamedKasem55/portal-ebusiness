import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { window } from 'ngx-bootstrap/utils'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { ConfigResourceService } from 'app/core/config/config.resource.local'

@Component({
  selector: 'all-comp',
  templateUrl: './all-comp.component.html',
  styleUrls: ['./all-comp.component.scss'],
})
export class AllCompComponent implements OnInit {
  @Output() onPagePicked = new EventEmitter<any>()
  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private _config: ConfigResourceService,
  ) {}

  ngOnInit(): void {}

  agreeWithTerms() {}

  onChangeTerms() {
  }

  proceed() {}

  public onPage(page: any): void {
    this.onPagePicked.emit(page)
  }

  openTermsAndConditions() {
    window.open(
      this._config.getDocumentUrl() +
        '/AlRajhi_Business_FAQ_V2.4_' +
        this.translate.currentLang +
        '.pdf',
    )
  }
}
