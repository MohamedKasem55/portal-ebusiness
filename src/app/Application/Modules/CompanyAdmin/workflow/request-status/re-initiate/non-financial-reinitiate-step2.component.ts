import {Component, Input, Injector, LOCALE_ID, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type';

@Component({
    selector: 'non-financial-reinitiate-step2',
    templateUrl: './non-financial-reinitiate-step2.component.html',
})
export class NonFinancialReinitiateStep2Component implements OnInit {
        @Input() sharedData: any
        @Input() selectedItem: any
        @Input() generateChallengeAndOTP: ResponseGenerateChallenge
        constructor(public translate: TranslateService, public router: Router) {
        }

        ngOnInit(): void {
            console.log("🚀 ~ file: non-financial-reinitiate-step2.component.ts ~ line 12 ~ NonFinancialReinitiateStep2Component ~ selectedItem", this.selectedItem)

        }

        public isEdited(paymentId: string): boolean {
            return true
            // return (
            //     this.sharedData.modifiedPayments.find(p => p === paymentId) !== undefined
            // )
        }
}
