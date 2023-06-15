import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {StaticService} from "../../../Common/Services/static.service";
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationService} from "../../../../../core/security/authentication.service";
import {NavigationEnd, Router} from "@angular/router";
import {LetterGuaranteeListService} from "../letter-guarantee-list/letter-guarantee-list.service";
import {AbstractDatatableMobileComponent} from "../../../Common/Components/Abstract/abstract-datatable-mobile.component";
import {AgreementType, AppAgreementsConfig} from "./app-agreements-config";
import {ConfigResourceService} from "../../../../../core/config/config.resource.local";

@Component({
    selector: 'app-app-agreement',
    templateUrl: './app-agreement.component.html',
    styleUrls: ['./app-agreement.component.scss']
})
export class AppAgreementComponent extends AbstractDatatableMobileComponent implements OnInit{

    availableAgreements: AppAgreementsConfig = new AppAgreementsConfig();
    currentAgreement: AgreementType;
    currentAgreementName: string

    constructor(
        public fb: FormBuilder,
        public staticService: StaticService,
        public translate: TranslateService,
        public authenticationService: AuthenticationService,
        public router: Router,
        public listService: LetterGuaranteeListService,
        public config: ConfigResourceService,
    ) {
        super(fb, translate, authenticationService, router)
        this.currentAgreementName = this.router.url.split('/').pop()
        this.currentAgreement = this.availableAgreements[this.currentAgreementName]
        router.events.subscribe(event => {
            if(event instanceof NavigationEnd){
                this.currentAgreementName = this.router.url.split('/').pop()
                this.currentAgreement = this.availableAgreements[this.currentAgreementName]
            }
        })

    }

    ngOnInit(): void {
    }

    getId(row): any {
    }

    getList(searchElement, order, orderType, offset, pageSize) {
    }

    downloadAgreement(row: any) {
        const link = document.createElement("a");
        link.href = this.config.getDocumentUrl() + row.link;
        link.download = row.link.slice(1);
        link.click();
    }

}
