import {Component, Input, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'

@Component({
    selector: 'app-workflow-non-account-step3',
    templateUrl: './step3.component.html',
})
export class NonAccountStep3Component implements OnInit {
    @Input() sharedData: any

    constructor(public router: Router, public translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    finish() {
        this.router.navigate(['/companyadmin/workflow'])
    }
}
