import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { menu, menupublicSector, UserResourceInterface } from './menu.json'
import {ConfigResourceService} from "../../../../config/config.resource.local";

@Component({
  selector: 'app-user-resources',
  templateUrl: './user-resources.component.html',
  styleUrls: ['./user-resources.component.scss'],
})
export class UserResourcesComponent implements OnInit {
  public resources: UserResourceInterface[]

  constructor(public translate: TranslateService,
              public config: ConfigResourceService,
  ) {}

  ngOnInit() {
    if (localStorage.getItem('typeUrl') == 'publicsector') {
      this.resources = menupublicSector
    } else {
      this.resources = menu
    }
  }

  public getTitleToUpperCase(strTranslation: string) {
    return this.translate.instant(strTranslation).toUpperCase()
  }

  public getDocUrl(item: any): string{
    if(this.translate.currentLang === 'ar'){
      return item.link.replace('{{docUrl}}', this.config.getDocumentUrl())
    }
    return item.linkEn.replace('{{docUrl}}', this.config.getDocumentUrl())
  }
}
