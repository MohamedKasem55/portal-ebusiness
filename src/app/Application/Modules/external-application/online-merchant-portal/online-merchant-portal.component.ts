import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ExternalApplicationService} from "../service/external-application.service";
import {ExternalApplicationTokenResponse} from "../model/external-application-token-response";

@Component({
    selector: 'arb-online-merchant-portal',
    templateUrl: './online-merchant-portal.component.html',
    styleUrls: ['./online-merchant-portal.component.scss']
})
export class OnlineMerchantPortalComponent implements OnInit {

    lang: string;

    constructor(private router: Router, private extService: ExternalApplicationService, private translate: TranslateService) {
        this.fetchLanguage();
    }

    ngOnInit(): void {
    }

    back() {
        this.router.navigate(['/'])
    }

    proceed() {
        this.extService.getToken('emcrey').subscribe(
            (res: ExternalApplicationTokenResponse) => {
                const url = res.redirectLink + res.token + '&lang=' + ((this.lang === 'en') ? this.lang + '_US' : this.lang + '_SA');
                window.open(url);
            }
        )
    }

    fetchLanguage() {
        this.lang = this.translate.currentLang;
        this.translate.onLangChange.subscribe(
            (lang) => {
                this.lang = lang.lang;
            }
        )
    }

}
