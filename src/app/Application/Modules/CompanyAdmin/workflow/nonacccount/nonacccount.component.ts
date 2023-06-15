import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Exception } from 'app/Application/Model/exception'
import { Subscription } from 'rxjs'
import { CompanyAdminWorkflowService } from '../../Services/workflow.service'

@Component({
    templateUrl: './nonacccount.component.html',
})
export class NonAccountComponent implements OnInit, OnDestroy {
    wizardStep: number
    sharedData: any = {}
    mensajeError: any = {}
    subscriptions: Subscription[] = []
    dataWithoutModify: any = {}

    constructor(
        public service: CompanyAdminWorkflowService,
        public router: Router,
    ) {
        this.wizardStep = 1
    }

    ngOnInit() {
        this.wizardStep = 1
        this.subscriptions.push(
            this.service.getAllLevels().subscribe((result) => {
                this.sharedData = result
                this.dataWithoutModify = JSON.parse(JSON.stringify(result))
                this.sharedData.modifiedPayments = []
            }),
        )
    }

    onError(error: any) {
        const res = error
        if (typeof res.error != 'undefined') {
            this.mensajeError['code'] = res.error.errorCode
            this.mensajeError['description'] = res.error.errorDescription
        }
    }

    next() {
        switch (this.wizardStep) {
            case 1: {
                let data = this.sharedData.modifiedPayments

                this.subscriptions.push(
                    this.service.validateLevels(data, '').subscribe((result) => {
                        if (result instanceof Exception && result['errorcode'] !== 0) {
                            this.onError(result)
                            this.sharedData.modifiedPayments = []
                            return
                        } else {
                            this.sharedData['result'] = result
                            this.sharedData['batchList'] = result.batchList
                            this.wizardStep = this.wizardStep + (1 % 3)
                        }
                    }),

                )
                break
            }
            case 2: {
                this.subscriptions.push(
                    this.service
                        .confirmLevels(this.sharedData.result.batchList, '')
                        .subscribe((result) => {
                            this.sharedData['result'] = result
                            this.wizardStep = this.wizardStep + (1 % 3)
                        }),
                )
                break
            }
            default: {
                this.wizardStep = this.wizardStep + (1 % 3)
                break
            }
        }
    }

    isDataModified(){
        return this.sharedData.modifiedPayments.length == 0;
    }

    previous() {
        this.wizardStep = this.wizardStep - (1 % 3)
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe())
        this.subscriptions = []
        this.sharedData = null
    }
}
