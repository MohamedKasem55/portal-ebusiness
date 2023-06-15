import { FormArray } from '@angular/forms'
import { WORKFLOW } from './../workflow-details-popup/workflow-details-popup.component'
import { FormGroup } from '@angular/forms'
import { Component, OnInit, Input } from '@angular/core'

export interface WorkflowData {
  titlePrefix?: string
  workflow: WORKFLOW
  formGroup: FormGroup
  showAmountInterval: boolean
}

@Component({
  selector: 'app-workflow-detail-table',
  templateUrl: './workflow-detail-table.component.html',
  styleUrls: ['./workflow-detail-table.component.scss'],
})
export class WorkflowDetailTableComponent implements OnInit {
  private _workflowData: WorkflowData
  @Input() set workflowData(workflowData: WorkflowData) {
    this._workflowData = workflowData

    this.prefixTitle = workflowData.titlePrefix
    this.title = workflowData.workflow.toLowerCase()
    this.showAmountInterval = workflowData.showAmountInterval
    // this.showAmountInterval = (workflowData.formGroup.get('tiers') as FormArray).controls.some((c) => !!c.get('amountMin') && !!c.get('amountMax'));
    this.formGroup = workflowData.formGroup
    const numberOfLevelsInTiers = (
      workflowData.formGroup.get('tiers') as FormArray
    ).controls.map((tier) => (tier.get('levels') as FormArray).length)
    this.numberOfLevels = new Array<void>(Math.max(...numberOfLevelsInTiers))
  }

  public prefixTitle: string
  public title: string
  public showAmountInterval: boolean
  public formGroup: FormGroup
  public numberOfLevels: void[]

  constructor() {}

  ngOnInit(): void {}

  getTiers(): FormGroup[] {
    return (this.formGroup.get('tiers') as FormArray).controls.map(
      (c) => c as FormGroup,
    )
  }
}
