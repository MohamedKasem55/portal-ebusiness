import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ResponseGenerateChallenge} from "../../../Model/responsegeneratechallenge.type";

@Component({
    selector: 'app-quick-own-transfer-step4',
    templateUrl: './quick-own-transfer-step4.component.html',
    styleUrls: ['./quick-own-transfer-step4.component.scss']
})
export class QuickOwnTransferStep4Component implements OnInit, OnDestroy {
    @Input() buttonLabel: string
    @Input() show: boolean
    @Input() generateChallengeAndOTP: any
    @Output() onNext = new EventEmitter<boolean>()
    @Output() onInit = new EventEmitter<Component>()

    ngOnInit() {
        this.onInit.emit(this as Component)
    }

    ngOnDestroy() {
    }

    cancel() {
        this.onNext.emit(false)
    }

    submit() {
        this.onNext.emit(true)
    }

    isPending() {
        return !(this.generateChallengeAndOTP &&
            (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
                this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
                this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE'));
    }
}

