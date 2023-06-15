import {
  AfterViewChecked,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { SelectedDataService } from '../../Accounts/Services/selected-data-service'
import { TransferOwnService } from '../Services/transfer-own.service'
import { QuickTransferStep1Widget } from './home-quick-transfer-step1.component'
import { QuickTransferStep2InternationalWidget } from './international/home-quick-transfer-international-step2.component'
import { QuickTransferStep3InternationalWidget } from './international/home-quick-transfer-international-step3.component'
import { QuickTransferStep4InternationalWidget } from './international/home-quick-transfer-international-step4.component'
import { QuickTransferStep5InternationalWidget } from './international/home-quick-transfer-international-step5.component'
import { QuickTransferStep3LocalWidget } from './local/home-quick-transfer-local-step3.component'
import { QuickTransferStep4LocalWidget } from './local/home-quick-transfer-local-step4.component'
import { QuickTransferStep5LocalWidget } from './local/home-quick-transfer-local-step5.component'
import { QuickTransferStep6LocalWidget } from './local/home-quick-transfer-local-step6.component'
import { BeneficiaryService } from '../Services/beneficiary.service'
import { QuickTransferStep2LocalWidget } from './local/home-quick-transfer-local-step2.component'
import { QuickTransferStep3IPSWidget } from './ips/home-quick-transfer-quick-step3.component'
import {QuickOwnTransferStep4Component} from "../../own-transfer-shared/quick-own-transfer-step4/quick-own-transfer-step4.component";
import {QuickOwnTransferStep3Component} from "../../own-transfer-shared/quick-own-transfer-step3/quick-own-transfer-step3.component";
import {QuickOwnTransferStep2Component} from "../../own-transfer-shared/quick-own-transfer-step2/quick-own-transfer-step2.component";
import {WithinTransferStep2Component} from "../../al-rajhi-transfer-shared/within-transfer-step2/within-transfer-step2.component";
import {WithinTransferStep5Component} from "../../al-rajhi-transfer-shared/within-transfer-step5/within-transfer-step5.component";
import {WithinTransferStep4Component} from "../../al-rajhi-transfer-shared/within-transfer-step4/within-transfer-step4.component";
import {WithinTransferStep3Component} from "../../al-rajhi-transfer-shared/within-transfer-step3/within-transfer-step3.component";

@Component({
    selector: 'quick-transfer',
    templateUrl: '../View/home-quick-tranfer.html',
})
export class QuickTransferWidget implements OnInit, OnDestroy {
    @ViewChild(QuickTransferStep1Widget)
    step1OwnComponent: QuickTransferStep1Widget

    @ViewChild(QuickOwnTransferStep2Component)
    step2OwnComponent: QuickOwnTransferStep2Component
    @ViewChild(QuickOwnTransferStep3Component)
    step3OwnComponent: QuickOwnTransferStep3Component
    @ViewChild(QuickOwnTransferStep4Component)
    step4OwnComponent: QuickOwnTransferStep4Component

    @ViewChild(WithinTransferStep2Component)
    step2WithinComponent: WithinTransferStep2Component
    @ViewChild(WithinTransferStep3Component)
    step3WithinComponent: WithinTransferStep3Component
    @ViewChild(WithinTransferStep4Component)
    step4WithinComponent: WithinTransferStep4Component
    @ViewChild(WithinTransferStep5Component)
    step5WithinComponent: WithinTransferStep5Component

    @ViewChild(QuickTransferStep2InternationalWidget)
    step2InternationalComponent: QuickTransferStep2InternationalWidget
    @ViewChild(QuickTransferStep3InternationalWidget)
    step3InternationalComponent: QuickTransferStep3InternationalWidget
    @ViewChild(QuickTransferStep4InternationalWidget)
    step4InternationalComponent: QuickTransferStep4InternationalWidget
    @ViewChild(QuickTransferStep5InternationalWidget)
    step5InternationalComponent: QuickTransferStep5InternationalWidget

    @ViewChild(QuickTransferStep2LocalWidget)
    step2LocalComponent: QuickTransferStep2LocalWidget
    @ViewChild(QuickTransferStep3LocalWidget)
    step3LocalComponent: QuickTransferStep3LocalWidget
    @ViewChild(QuickTransferStep4LocalWidget)
    step4LocalComponent: QuickTransferStep4LocalWidget
    @ViewChild(QuickTransferStep5LocalWidget)
    step5LocalComponent: QuickTransferStep5LocalWidget
    @ViewChild(QuickTransferStep6LocalWidget)
    step6LocalComponent: QuickTransferStep6LocalWidget

    @ViewChild(QuickTransferStep3IPSWidget)
    step3QuickComponent: QuickTransferStep3IPSWidget

    steps: any[]

    currentStep: number
    currentTransfer: string
    step1Form: FormGroup
    step2Form: FormGroup
    step3Form: FormGroup

    LOCAL = 'localTransfer'
    ALRAJHI = 'rajhiTransfer'
    INTERNATIONAL = 'internationalTransfer'
    OWN = 'owerTransfer'
    QUICK = 'quickTransfer'

    dataInternationalTransfer: any
    dataLocalTransfer: any
    dataWithinTransfer: any
    dataOwnTransfer: any
    dataQuickTransfer: any

    selectedWithinBeneficiaries: any = []
    selectedLocalBeneficiaries: any = []
    selectedInternationalBeneficiaries: any = []

    subscriptions: Subscription[] = []

    selectedAccount: any
    step3Object: any;

    constructor(
        private fb: FormBuilder,
        public service: TransferOwnService,
        private route: ActivatedRoute,
        public router: Router,
        private authenticationService: AuthenticationService,
        public sharedAccountData: SelectedDataService,
        public beneficiariesService: BeneficiaryService,
    ) {
        this.currentStep = 1
        this.currentTransfer = null

        this.goStep1()
    }

    changeTransferType(value) {
        this.currentTransfer = value
    }

    onInitStep1(events) {
        //console.log('recibido init 1');
        this.beneficiariesService.selectedWithinBeneficiaries = []
        this.beneficiariesService.selectedLocalBeneficiaries = []
        this.beneficiariesService.selectedInternationalBeneficiaries = []

        this.step1OwnComponent = events
    }

    createStep1Form() {
        this.step1Form = this.fb.group({
            operationType: ['', Validators.required],
        })
    }

    //OWN TRANSFER
    onInitStep2Own(events) {
        //console.log('recibido init 2');
        this.step2OwnComponent = events
    }

    onInitStep3Own(events) {
        //console.log('recibido init 3');
        this.step3OwnComponent = events
    }

    onInitStep4Own(events) {
        //console.log('recibido init 4');
        this.step4OwnComponent = events
    }

    //WITHIN  TRANSFER
    onInitStep2Within(events) {
        //console.log('recibido init 2');
        this.step2WithinComponent = events
    }

    onInitStep3Within(events) {
        //console.log('recibido init 3');
        this.step3WithinComponent = events
    }

    onInitStep4Within(events) {
        //console.log('recibido init 4');
        this.step4WithinComponent = events
    }

    onInitStep5Within(events) {
        //console.log('recibido init 4');
        this.step5WithinComponent = events
    }

    //LOCAL  TRANSFER

    onInitStep2Local(events) {
        //console.log('recibido init 2');
        this.step2LocalComponent = events
    }

    onInitStep3Local(events) {
        //console.log('recibido init 2');
        this.step3LocalComponent = events
    }

    onInitStep4Local(events) {
        //console.log('recibido init 3');
        this.step4LocalComponent = events
    }

    onInitStep5Local(events) {
        //console.log('recibido init 4');
        this.step5LocalComponent = events
    }

    onInitStep6Local(events) {
        //console.log('recibido init 4');
        this.step6LocalComponent = events
    }

    //INTERNATIONAL  TRANSFER
    onInitStep2International(events) {
        //console.log('recibido init 2');
        this.step2InternationalComponent = events
    }

    onInitStep3International(events) {
        //console.log('recibido init 3');
        this.step3InternationalComponent = events
    }

    onInitStep4International(events) {
        //console.log('recibido init 4');
        this.step4InternationalComponent = events
    }

    onInitStep5International(events) {
        //console.log('recibido init 4');
        this.step5InternationalComponent = events
    }

    ngOnInit() {
        this.selectedAccount =
            this.sharedAccountData.getModelServiceCurrentAccount()
        this.sharedAccountData.clearModelServiceCurrentAccount()
        this.route.params.subscribe((params) => {
            if (params['operationType'] && params['operationType'] !== '') {
                this.ngOnDestroy()
                this.goStep1()
                this.currentTransfer = params['operationType']
                this.step1Form.controls['operationType'].setValue(this.currentTransfer)
                this.nextStep()
            }
        })
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => {
            sub.unsubscribe()
        })
        this.subscriptions = []
    }

    futureStep(next) {
        if (next) {
            this.nextStep()
        } else {
            this.previousStep()
        }
    }

    nextStep() {
        let maxStep
        if (this.currentTransfer == this.OWN) {
            maxStep = 4
        } else if (this.currentTransfer === this.LOCAL) {
            maxStep = 6
        } else {
            maxStep = 5
        }
        if (this.currentStep < maxStep) {
            const step = this.currentStep + 1
            switch (step) {
            case 1:
                this.goStep1()
                break
            case 2:
                this.goStep2()
                break
            case 3:
                this.goStep3()
                break
            case 4:
                this.goStep4()
                break
            case 5:
                this.goStep5()
                break
            case 6:
                this.goStep6()
                break
            }
        } else {
            this.currentTransfer = null
            this.goStep1()
            void this.router.navigate(['transfers'])
            return
        }
        //console.log("nextStep "+this.currentStep);
    }

    previousStep() {
        if (this.currentStep == 2) {
            void this.router.navigate(['transfers'])
        }
        if (this.currentStep > 1) {
            this.currentStep--
        }
        if (this.currentStep == 2) {
            // this.selectedWithinBeneficiaries = [];
            // this.selectedLocalBeneficiaries = [];
            // this.selectedInternationalBeneficiaries = [];
        }
        //console.log("previousStep "+this.currentStep);
    }

    goStep1() {
        this.createStep1Form()
        this.selectedWithinBeneficiaries = []
        this.selectedLocalBeneficiaries = []
        this.selectedInternationalBeneficiaries = []

        this.beneficiariesService.selectedWithinBeneficiaries = []
        this.beneficiariesService.selectedLocalBeneficiaries = []
        this.beneficiariesService.selectedInternationalBeneficiaries = []

        this.subscriptions.push(
            this.step1Form.controls['operationType'].valueChanges.subscribe(
                (value) => {
                    this.changeTransferType(value)
                },
            ),
        )
        this.currentStep = 1
    }

    goStep2() {
        const transferType = this.step1Form.value.operationType
        //console.log('creo el form step2');
        this.step2Form = this.fb.group({
            operationType: transferType,
        })
        this.currentStep = 2
    }

    goStep3() {
        const transferType = this.step1Form.value.operationType
        //console.log('creo el form step2');
        this.step3Form = this.fb.group({
            operationType: transferType,
        })
        if (this.LOCAL === transferType) {
            const localType = this.step2Form.value.operationType
            if (this.QUICK === localType) {
                this.currentTransfer = this.QUICK
            } else {
                this.currentTransfer = this.LOCAL
                //just go to next stop
            }
        } else if (this.INTERNATIONAL === transferType) {
            //Añado el campo beneficiarios
            this.step3Form.addControl('beneficiaries', this.fb.array([]))
            this.dataInternationalTransfer = {}
            this.dataInternationalTransfer['step2'] = {}
            //recupero datos del paso 2 para pasarlos al 3
            //console.log(this.dataInternationalTransfer['step2']['initTransferData']);
            this.dataInternationalTransfer['step2']['initTransferData'] =
                this.step2InternationalComponent.initTransferData
            this.dataInternationalTransfer['step2']['fillBeneficiariesData'] =
                this.step2InternationalComponent.fillBeneficiariesData
        } else if (this.ALRAJHI === transferType) {
            //Añado el campo beneficiarios
            this.step3Form.addControl('beneficiaries', this.fb.array([]))
            this.dataWithinTransfer = {}
            this.dataWithinTransfer['step2'] = {}
            //recupero datos del paso 2 para pasarlos al 3
            this.dataWithinTransfer['step2']['initTransferData'] =
                this.step2WithinComponent.initTransferData
            this.dataWithinTransfer['step2']['fillBeneficiariesData'] =
                this.step2WithinComponent.fillBeneficiariesData
        } else if (this.OWN === transferType) {
            //recupero datos del paso 2 para pasarlos al 3
            this.dataOwnTransfer = {}
            this.dataOwnTransfer['step2'] = {}
            this.dataOwnTransfer['step2']['selectedAccountFrom'] =
                this.step2OwnComponent.selectedAccountFrom
            this.dataOwnTransfer['step2']['selectedAccountTo'] =
                this.step2OwnComponent.accountToSelected
            this.dataOwnTransfer['step2']['accountsFrom'] =
                this.step2OwnComponent.accountsFrom
            this.dataOwnTransfer['step2']['accountsTo'] =
                this.step2OwnComponent.accountsTo
            this.dataOwnTransfer['step2']['reasons'] = this.step2OwnComponent.reasons
            this.dataOwnTransfer['step2']['exchangeRate'] =
                this.step2OwnComponent.exchangeRate
            this.dataOwnTransfer['step2']['amount2'] = this.step2OwnComponent.amount2
            this.dataOwnTransfer['step2']['currencies'] =
                this.step2OwnComponent.currencies
        }
        this.currentStep = 3
    }

    goStep4() {
        const transferType = this.step1Form.value.operationType
        if (this.LOCAL === transferType) {
            const localType = this.step2Form.value.operationType
            if (this.QUICK === localType) {
                this.currentTransfer = this.QUICK
                this.dataQuickTransfer = {}
                this.dataQuickTransfer['step3'] = {}
                this.dataQuickTransfer['step3']['initTransferData'] =
                    this.step3QuickComponent.initTransferData
                this.dataQuickTransfer['step3']['transferValidateResponse'] =
                    this.step3QuickComponent.transferValidateResponse
            } else {
                //Añado el campo beneficiarios
                this.step3Form.addControl('beneficiaries', this.fb.array([]))
                this.dataLocalTransfer = {}
                this.dataLocalTransfer['step3'] = {}
                //recupero datos del paso 2 para pasarlos al 3
                this.dataLocalTransfer['step3']['initTransferData'] =
                    this.step3LocalComponent.initTransferData
                this.dataLocalTransfer['step3']['fillBeneficiariesData'] =
                    this.step3LocalComponent.fillBeneficiariesData
            }
        } else if (this.INTERNATIONAL === transferType) {
            this.dataInternationalTransfer['step3'] = {}
            this.dataInternationalTransfer['step3']['confirmSave'] =
                this.step3InternationalComponent.confirmSave
            this.dataInternationalTransfer['step3']['reasons'] =
                this.step3InternationalComponent.reasons
        } else if (this.ALRAJHI === transferType) {
            this.dataWithinTransfer['step3'] = {}
            this.dataWithinTransfer['step3']['confirmSave'] =
                this.step3WithinComponent.confirmSave
            this.dataWithinTransfer['step3']['currencies'] =
                this.step3WithinComponent.currencies
        } else if (this.OWN === transferType) {
            this.dataOwnTransfer['step3'] = {}
            this.dataOwnTransfer['step3']['generateChallengeAndOTP'] =
                this.step3OwnComponent?.ownTransferValidateResponse?.generateChallengeAndOTP
        }
        this.currentStep = 4
    }

    goStep5() {
        const transferType = this.step1Form.value.operationType
        if (this.LOCAL === transferType) {
            const localType = this.step2Form.value.operationType
            if (this.QUICK === localType) {
                this.currentTransfer = this.QUICK
            } else {
                this.dataLocalTransfer['step4'] = {}
                this.dataLocalTransfer['step4']['currencies'] =
                    this.step4LocalComponent.currencies
                this.dataLocalTransfer['step4']['confirmSave'] =
                    this.step4LocalComponent.confirmSave
                // tslint:disable-next-line:no-bitwise
                this.dataLocalTransfer['step4']['totalAmount'] =
                    this.dataLocalTransfer['step4']['confirmSave'].totalAmountProcess +
                    this.dataLocalTransfer['step4']['confirmSave'].totalAmountAuthorize
            }
        } else if (this.INTERNATIONAL === transferType) {
        } else if (this.ALRAJHI === transferType) {
        }
        this.currentStep = 5
    }

    goStep6() {
        const transferType = this.step1Form.value.operationType
        if (this.LOCAL === transferType) {
        } else if (this.INTERNATIONAL === transferType) {
        } else if (this.ALRAJHI === transferType) {
        }
        this.currentStep = 6
    }

    onError(result) {
    }

    isOwnTransfer() {
        if (this.OWN === this.step1Form.controls['operationType'].value) {
            return true
        } else {
            return false
        }
    }

    isLocal(): boolean {
        return this.LOCAL === this.step1Form.controls['operationType'].value
    }

    isQuick(): boolean {
        return this.QUICK === this.step2Form.controls['operationType'].value
    }

    localReset() {
        this.currentStep = 2
    }

    onStep3InIt(sharedData) {
        this.step3Object = sharedData;
    }
}
