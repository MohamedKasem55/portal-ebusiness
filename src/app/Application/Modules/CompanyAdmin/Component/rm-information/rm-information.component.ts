import { Component, Injector, OnInit, SimpleChanges } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { Exception } from 'app/Application/Model/exception';
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component';
import { Subscription } from 'rxjs';
import { StorageService } from '../../../../../core/storage/storage.service'
import { RmInformationService } from '../../Services/rm-information.service';

@Component({
  selector: 'app-rm-information',
  templateUrl: './rm-information.component.html',
  styleUrls: ['./rm-information.component.scss']
})
export class RmInformationComponent extends AbstractAppComponent implements OnInit {
  public sharedData: any = {}
  public contactNumber: number = 920004550;
  public languaje:string='';
  subscriptionsLanguage: Subscription
  routes: any[] = [
    ['dashboard.preferences'],
    ['menu.company_admin.rmInformation.relationshipManager']
  ]
  constructor(public storageService: StorageService, public injector: Injector, public rmInformationService: RmInformationService, public translate: TranslateService,) {
    super(translate)
  }

  ngOnInit(): void {
    this.subscriptionsLanguage = this.translate.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        this.getLanguaje()
      },
    )
    this.loadRMInformation();
  }
  loadRMInformation() {
    this.subscriptions.push(
      this.rmInformationService.getRMInformation().subscribe((result) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.sharedData.relationshipManagerInfoDTO = result['relationshipManagerInfoDTO'];
        }
      }),
    )
  }

  getLanguaje(){
    this.languaje= this.storageService.retrieve('currentLanguage');
  }
}
