import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'

@Component({
    selector: 'app-workflow-non-account-step2',
    templateUrl: './step2.component.html',
})
export class NonAccountStep2Component implements OnInit {
    @Input() sharedData: any

    constructor(public translate: TranslateService, public router: Router) {
    }

    ngOnInit(): void {
    }

    public isEdited(paymentId: string): boolean {
        return (
            this.sharedData.modifiedPayments.find(p => p.paymentId === paymentId) !== undefined
        )
    }
}
