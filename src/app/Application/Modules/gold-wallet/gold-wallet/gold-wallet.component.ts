import {Component, OnInit} from '@angular/core';
import {GoldWalletService} from "../service/gold-wallet.service";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {SimpleMQ} from "ng2-simple-mq";

@Component({
    selector: 'arb-gold-wallet',
    templateUrl: './gold-wallet.component.html',
    styleUrls: ['./gold-wallet.component.scss']
})
export class GoldWalletComponent implements OnInit {

    constructor(private goldWalletService: GoldWalletService,
                private router: Router,
                private smq: SimpleMQ,
                private translate: TranslateService) {
        this.goldWalletService.checkWalletAvaility().subscribe((res: any) => {
            if (!res.eligible) {
                this.translate.get('gold-wallet.eligibility-error').subscribe(
                    (value) => {
                        this.smq.publish('error-mq', value);
                    });
                void this.router.navigate(['/']);
            } else {
                if (res.hasExistingWallet) {
                    this.smq.publish('loader-mq', false)
                    void this.router.navigate(['/gold-wallet/dashboard']);
                } else if (!res.hasExistingWallet) {
                    this.smq.publish('loader-mq', false)
                    void this.router.navigate(['/gold-wallet/on-boarding']);
                }
            }
        });
    }

    ngOnInit(): void {
    }


}
