import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {ResponseGenerateChallenge} from "../../../Model/responsegeneratechallenge.type";

@Component({
    selector: 'app-within-transfer-step5',
    templateUrl: './within-transfer-step5.component.html',
    styleUrls: ['./within-transfer-step5.component.scss']
})
export class WithinTransferStep5Component implements OnInit, OnDestroy {

    @Input() buttonLabel: string
    @Input() show: boolean
    @Input() generateChallengeAndOTP: ResponseGenerateChallenge
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
        if (
            this.generateChallengeAndOTP &&
            (this.generateChallengeAndOTP.typeAuthentication === 'STATIC' ||
                this.generateChallengeAndOTP.typeAuthentication === 'OTP' ||
                this.generateChallengeAndOTP.typeAuthentication === 'CHALLENGE')
        ) {
            return false
        } else {
            return true
        }
    }
}
