import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from 'app/Application/Modules/HajjUmrahCards/static.service'
import { NewSoftTokenService } from './new-soft-token.service'

@Component({
  templateUrl: './new-soft-token.component.html',
})
export class NewSoftTokenComponent implements OnInit {
  currentItem: any = null
  formModel: FormGroup = null
  entityProperties: any[] = []
  combosData: any[] = []

  constructor(
    public service: NewSoftTokenService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,

  ) {}

  ngOnInit() {}

  ngOnDestroy(): void {}

  onSelect(selected) {
    return selected
  }

  onClickItem(selected) {
    this.currentItem = selected
  }

  closeItem() {
    this.currentItem = null
  }
}
