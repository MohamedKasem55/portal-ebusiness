import {Component, Input, Output, ViewChild, EventEmitter} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {ModalDirective} from "ngx-bootstrap/modal";


@Component({
    selector: 'arb-bulk--error-payments',
    templateUrl: './bulk-error.component.html',
    styleUrls: ['./bulk-error.component.scss']
})
export class BulkErrorComponent {

    @Input() errorList: any = []
    @Output() closeModal = new EventEmitter<any>()
    @ViewChild('errorModal', {static: true}) errorModal: ModalDirective

    public defaultHeight: any = 'auto'

    constructor(public translate: TranslateService,) {
    }

    public showModal() {
        this.errorModal.show()
    }

    public hideModal() {
        this.errorModal.hide()
        this.closeModal.emit()
    }
}