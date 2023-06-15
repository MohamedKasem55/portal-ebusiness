import {Component, Input, OnInit} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'

@Component({
    selector: 'app-pre-paid-card-request-step4',
    templateUrl: './pre-paid-card-request-step4.component.html',
})
export class PrePaidCardRequestStep4Component implements OnInit {
    @Input() cardOrderId: string;

    constructor(public translate: TranslateService) {
    }

    ngOnInit(): void {
    }

}
