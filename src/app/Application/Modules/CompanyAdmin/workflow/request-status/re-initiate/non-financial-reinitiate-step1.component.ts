import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'non-financial-reinitiate-step1',
    templateUrl: './non-financial-reinitiate-step1.component.html',
})
export class NonFinancialReinitiateStep1Component implements OnInit{
    @Input() selectedItem: any
    sharedData:any
    workflowNonFinancialSelected:any
    workflowNonFinancialModified:any

    constructor(public translate: TranslateService) {
    }

    ngOnInit(): void {
        this.workflowNonFinancialSelected=this.selectedItem;
    }
    public addToModified(workflowChange: any): void {
        this.workflowNonFinancialModified = workflowChange;
    }

}
