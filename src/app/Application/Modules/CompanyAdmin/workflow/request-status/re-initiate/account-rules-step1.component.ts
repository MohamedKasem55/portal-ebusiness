import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core'
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'
import { Exception } from 'app/Application/Model/exception'
import { StorageService } from 'app/core/storage/storage.service'
import {SimpleMQ} from 'ng2-simple-mq'
import {ModalDirective} from 'ngx-bootstrap/modal'
import {Subscription} from 'rxjs'
import { AccountRulesService } from '../../../Services/workflow/account-rules/account-rules.service'

@Component({
    selector: 'app-rules-reinitiate-step1',
    templateUrl: './account-rules-step1.component.html',
})
export class AccountRulesReinitiateStep1Component implements OnInit, OnDestroy {
    @ViewChild('changeValuesModal', {static: true})
    public changeValuesModal: ModalDirective
    @Output() onInit = new EventEmitter<Component>()
    @Input() selectedItem: any;
    messageError = {}
    form: FormGroup
    accounts: any[] = []
    accountSelected: any
    accountRules
    remainingValue = {}

    objectToUpdate = {
        rules: null,
        index: null,
    }
    subscriptions: Subscription[] = []

    public initialsData = null

    companyPrivileges: any

    constructor(
        public router: Router,
        public fb: FormBuilder,
        public services: AccountRulesService,
        public translate: TranslateService,
        private storage: StorageService,
        private smq: SimpleMQ,
    ) {
        this.form = this.fb.group({
            accountNumber: [''],
            accountRules: new FormArray([]),
        })
    }

    ngOnInit() {
        this.onInit.emit(this as Component)
        const storageVal = this.storage.retrieve('currentuser')
        if (!storageVal) {
            return
        }
        const userTemp = JSON.parse(storageVal)
        this.companyPrivileges = userTemp.company.privileges
        // this.getAccounts()
        this.createForm()
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

    getAccounts() {
        this.services.getAccounts().subscribe((result: any) => {
            const body = result
            if (
                body.hasOwnProperty('error') &&
                (<any>body).error instanceof Exception
            ) {
                this.onError(body)
                return
            } else {
                this.accounts = result
                //
            }
        })
    }

    createForm() {
        this.accountRules = []


            this.form.controls.accountRules = new FormArray([])
            this.accountRules = this.selectedItem
            this.createAccountTableRules(this.form, this.accountRules)

    }

    createAccountTableRules(form: FormGroup, accountRules) {
        form.addControl('accountRules', this.fb.array([]))
        form.controls['accountNumber'].setValue(accountRules.accountNumber)
        const accountControl = <FormArray>form.controls['accountRules']
        accountControl.push(this.initAccountRules(accountRules))
            // this.adjustMinMaxControls(index, 0);
        this.initialsData = JSON.stringify(accountControl.value)
    }

    isFormAccountRulesDataDirty() {
        if (!this.form || !this.form.controls['accountRules']) {
            return false
        }
        const accountControl = <FormArray>this.form.controls['accountRules']
        const accountControlData = JSON.stringify(accountControl.value)
        return accountControlData !== this.initialsData
    }

    getRules(form) {
        return form.controls['rules'].controls
    }

    initAccountRules(account) {
        const ruleControl = new FormArray([])
        account.details.forEach((rules: any, index) => {
            ruleControl.push(this.initRules(ruleControl, rules, index))
        })
        return this.fb.group({
            label: account.paymentId,
            paymentId: account.paymentId,
            accountNumber: account.accountNumber,
            rules: ruleControl,
        })
    }

    initRules(ruleControl, rules, index) {
        const formGroup = this.fb.group(
            {
                amountMax: [
                    rules.amountMax <= 9999999999 ? rules.amountMax : null,
                    {
                        validators: Validators.compose([Validators.min(rules.amountMin)]),
                        updateOn: 'blur',
                    },
                ],
                amountOldMax: [rules.amountMax <= 9999999999 ? rules.amountMax : null],
                amountMin: [
                    {value: rules.amountMin, disabled: true},
                    Validators.required,
                ],
                containsLevels:
                    rules.containsLevels ||
                    rules.levels[0] ||
                    rules.levels[1] ||
                    rules.levels[2] ||
                    rules.levels[3] ||
                    rules.levels[4],
                l1: rules.levels[0],
                l2: rules.levels[1],
                l3: rules.levels[2],
                l4: rules.levels[3],
                l5: rules.levels[4],
                valid: true,
            },
            {validator: this.requiredOneLevel()},
        )
        return formGroup
    }

    updateValues() {
        const rules = this.objectToUpdate.rules
        const index = this.objectToUpdate.index
        this.objectToUpdate = {
            rules: null,
            index: null,
        }
        if (index >= 0 && rules.controls[index + 1]) {
            rules.controls[index + 1].controls['amountMin'].patchValue(
                parseFloat(rules.controls[index].controls['amountMax'].value) + 0.01,
            )
            rules.controls[index + 1].controls['amountMax'].clearValidators()
            rules.controls[index + 1].controls['amountMax'].setValidators(
                Validators.compose([
                    Validators.min(
                        parseFloat(rules.controls[index + 1].controls['amountMin'].value),
                    ),
                ]),
            )
            rules.controls[index + 1].controls['amountMax'].updateValueAndValidity()
        }
        this.changeValuesModal.hide()
    }

    cancelUpdateValues() {
        const rules = this.objectToUpdate.rules
        const index = this.objectToUpdate.index
        this.objectToUpdate = {
            rules: null,
            index: null,
        }
        rules.controls[index].controls['amountMax'].patchValue(
            rules.controls[index].controls['amountOldMax'].value,
        )
        this.changeValuesModal.hide()
    }

    requiredOneLevel() {
        return (group: FormGroup) => {
            const selectedLevel =
                group.controls['l1'].value ||
                group.controls['l2'].value ||
                group.controls['l3'].value ||
                group.controls['l4'].value ||
                group.controls['l5'].value
            if (
                group.controls['amountMax'].value !== null &&
                group.controls['amountMax'].value !== undefined &&
                group.controls['amountMax'].value !== '' &&
                !selectedLevel
            ) {
                return group.controls['l1'].setErrors({selectOneLevel: true})
            } else {
                group.controls['l1'].setErrors(null)
            }
        }
    }

    addRule(rowIndex) {
        const ruleControl = this.form.controls.accountRules['controls'][rowIndex]
            .controls.rules
        ruleControl.push(this.newRules(ruleControl))
        // this.adjustMinMaxControls(rowIndex, 0);
    }

    newRules(controls) {
        const index = controls.length - 1
        const c = controls
        const formGroup = this.fb.group(
            {
                amountMin: [
                    {
                        value:
                            parseFloat(c.controls[index].controls['amountMax'].value) + 0.01,
                        disabled: true,
                    },
                    Validators.required,
                ],
                amountMax: [
                    null,
                    {
                        validators: Validators.compose([
                            Validators.min(
                                index >= 0
                                    ? parseFloat(c.controls[index].controls['amountMax'].value) +
                                    0.01
                                    : 0.0,
                            ),
                        ]),
                        updateOn: 'blur',
                    },
                ],
                amountOldMax: [null],
                containsLevels: false,
                l1: false,
                l2: false,
                l3: false,
                l4: false,
                l5: false,
                valid: false,
            },
            {validator: this.requiredOneLevel()},
        )
        return formGroup
    }

    isAmountSet(privilegeIndex) {
        const ruleControl = this.form.controls.accountRules['controls'][
            privilegeIndex
            ].controls.rules
        const index = ruleControl.length - 1
        return ruleControl.controls[index].controls['amountMax'].value == null
    }

    containsLevels(privilegeIndex, rowIndex) {
        const levelControl = this.form.controls.accountRules['controls'][
            privilegeIndex
            ].controls.rules.controls[rowIndex]
        if (
            levelControl.controls['l1'].value ||
            levelControl.controls['l2'].value ||
            levelControl.controls['l3'].value ||
            levelControl.controls['l4'].value ||
            levelControl.controls['l5'].value
        ) {
            levelControl.controls['containsLevels'].setValue(true)
        } else {
            levelControl.controls['containsLevels'].setValue(false)
        }
        this.adjustMinMaxControls(privilegeIndex, rowIndex)
    }

    removeRule(rowIndex, rowId) {
        const ruleControl = this.form.controls.accountRules['controls'][rowIndex]
            .controls.rules
        ruleControl.removeAt(rowId)
        //this.accountRules.workflowTypePaymentList[rowIndex].details.splice(rowId,1);
    }

    onError(error: any) {
        const res = error
        this.messageError['code'] = res.error.errorCode
        this.messageError['description'] = res.error.errorDescription
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    adjustMinMaxControls(formGroupJ: number, formGroupI: number) {
        const controls = this.form.controls.accountRules['controls'][formGroupJ]
            .controls.rules.controls

        if (controls.length >= 1) {
            controls[0].controls.amountMin.setValue(0.0)
        }

        if (controls.length === 1) {
            if (
                controls[0].controls.amountMax.value === '' ||
                controls[0].controls.amountMax.value === null ||
                controls[0].controls.amountMax.value === undefined
            ) {
                controls[0].controls.l1.setValue(false)
                controls[0].controls.l2.setValue(false)
                controls[0].controls.l3.setValue(false)
                controls[0].controls.l4.setValue(false)
                controls[0].controls.l5.setValue(false)
                controls[0].controls.valid.setValue(true)
                return true
            }
        }

        for (let i = 0; i < controls.length; i++) {
            const maxValue = controls[i].controls.amountMax.value
            const decimals = ('' + maxValue + '.00').split('.')[1]
            if (decimals.length > 2) {
                controls[i].controls.amountMax.setValue(
                    Math.floor(maxValue * 100) / 100,
                )
            }
            //if (controls[i].controls.amountMax.value > 9999999.99) {
            //    controls[i].controls.amountMax.setValue(9999999.99);
            //}
            //if (controls[i].controls.amountMin.value > controls[i].controls.amountMax.value) {
            //    controls[i].controls.amountMax.setValue(parseFloat('' + parseInt(controls[i].controls.amountMin.value, 10)) + 1.00);
            //}
            if (i < controls.length - 1) {
                controls[i + 1].controls.amountMin.setValue(
                    parseFloat(controls[i].controls.amountMax.value) + 0.01,
                )
            }
            controls[i].controls.valid.setValue(
                controls[i].controls.amountMin.value <
                controls[i].controls.amountMax.value &&
                controls[i].controls.amountMax.value <=
                this._parseFloat('9999999999') &&
                (controls[i].controls.l1.value !== false ||
                    controls[i].controls.l2.value !== false ||
                    controls[i].controls.l3.value !== false ||
                    controls[i].controls.l4.value !== false ||
                    controls[i].controls.l5.value !== false),
            )
        }

        return true
    }

    isValidMinMaxControls() {
        let valid = true
        const privilegesControls = this.form.controls.accountRules['controls']
        privilegesControls.forEach(p => {
            const controls = p.controls.rules.controls
            for (let i = 0; i < controls.length; i++) {
                valid = valid && controls[i].controls.valid.value
            }
        })
        return valid
    }

    _parseFloat(value: any) {
        return parseFloat(value)
    }
}
