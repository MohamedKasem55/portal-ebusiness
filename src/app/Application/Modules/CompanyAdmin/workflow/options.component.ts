import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { StorageService } from 'app/core/storage/storage.service'

@Component({
    templateUrl: './options.component.html',
})
export class WorkflowOptionsComponent implements OnInit {
    selectedAccount: any
    dualAuthorization: boolean

    constructor(
        public router: Router,
        public authenticationService: AuthenticationService,
        public storage: StorageService,
    ) {
        this.dualAuthorization = JSON.parse(storage.retrieve('currentUser'))[
            'company'
          ]['dualAuthorization'];

    }

    ngOnInit() {
    }

    goNonAccounts() {
        this.router.navigate(['/companyadmin/workflow/nonAccountRules'])
    }

    goAccountRules() {
        this.router.navigate(['/companyadmin/workflow/accountRulesSearch'])
    }

    goEtrade() {
        this.router.navigate(['/companyadmin/workflow/eTrade'])
    }

    goRequestStatus() {
        this.router.navigate(['/companyadmin/workflow/requestStatus'])
    }
}
