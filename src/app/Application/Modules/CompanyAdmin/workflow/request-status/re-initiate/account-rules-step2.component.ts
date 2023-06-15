import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core'
import {FormBuilder, FormGroup} from '@angular/forms'
import {Router} from '@angular/router'
import {RequestValidate} from 'app/Application/Model/requestvalidateType'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import { StorageService } from 'app/core/storage/storage.service'

@Component({
    selector: 'app-rules-reinitiate-step2',
    templateUrl: './account-rules-step2.component.html',
})
export class AccountRulesReinitiateStep2Component implements OnInit {
    @Input() form: FormGroup
    @Input() generateChallengeAndOTP: ResponseGenerateChallenge
    @Input() requestValidate: RequestValidate
    @Input() selectedItem: any;
    @Output() onInit = new EventEmitter<Component>()
    @ViewChild('authorization') authorization: any

    account: any

    companyPrivileges: any

    constructor(
        public router: Router,
        public fb: FormBuilder,
        private storage: StorageService,
    ) {
    }

    ngOnInit() {
        const storageVal = this.storage.retrieve('currentuser')
        if (!storageVal) {
            return
        }
        const userTemp = JSON.parse(storageVal)
        this.companyPrivileges = userTemp.company.privileges
        this.form.disable()
        this.onInit.emit(this as Component)
    }

    getAccountLabelKey(labelKey) {
        if (labelKey === 'WF' /*|| labelKey === 'WL'*/) {
            let has_wps_privilege = false
            this.companyPrivileges.forEach(p => {
                if (p.privilegeId === 'WPSPAYROLL_PRIVILEGE') {
                    has_wps_privilege = true
                }
            })
            return has_wps_privilege ? labelKey : 'workflow.title.wmsPayroll'
        }
        return labelKey
    }

    getBatchTypeKey(labelKey) {
        if (labelKey === 'WF' /*|| labelKey === 'WL'*/) {
            let has_wps_privilege = false
            this.companyPrivileges.forEach(p => {
                if (p.privilegeId === 'WPSPAYROLL_PRIVILEGE') {
                    has_wps_privilege = true
                }
            })
            return has_wps_privilege ? 'batchTypes' : 'workflowBundle'
        }
        return 'batchTypes'
    }

    getRules(form) {
        return form.controls['rules'].controls
    }
}
