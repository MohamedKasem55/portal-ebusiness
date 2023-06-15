import {
    Component,
    Input
} from '@angular/core'
import {TranslateService} from '@ngx-translate/core'

@Component({
    selector: 'app-workflow-non-account-step1',
    templateUrl: './step1.component.html',
})
export class NonAccountStep1Component {
    @Input() sharedData: any
    @Input() dataWithoutModify: any = {}

    constructor(public translate: TranslateService) {}

    public addToModified(payment: any, key: string): void {
        if(this.dataWithoutModify.workflowList[key].find(p => JSON.stringify(p) === JSON.stringify(payment))){
            this.sharedData.modifiedPayments.splice(
                this.sharedData.modifiedPayments.findIndex((data) => data.paymentId == payment.paymentId), 1)
            console.log(this.sharedData.modifiedPayments)

        } else if (!this.sharedData.modifiedPayments.find(p => p === payment)) {
            this.sharedData.modifiedPayments.push(payment)
        }
    }
}
