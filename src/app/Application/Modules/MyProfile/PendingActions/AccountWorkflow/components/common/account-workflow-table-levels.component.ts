import { Component, Input, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-account-workflow-table-levels',
  templateUrl: './account-workflow-table-levels.component.html',
  styleUrls: ['./account-workflow-table-levels.component.scss'],
})
export class AccountWorkflowTableLevelsComponent implements OnInit {
  @Input() details: any
  // @Input() details: any = [{
  //   workflowAccountDetailPk: null,
  //   amountMin: null,
  //   amountMax: null,
  //   l1: false,
  //   l2: false,
  //   l3: false,
  //   l4: false,
  //   l5: false,
  // }]
  @Input() isMobile: boolean = false
  form: FormGroup
  detailsList: FormArray;
  constructor(public translate: TranslateService, public fb: FormBuilder) {

  }
  ngOnInit(): void {
    if (this.details) {
      this.detailsList = this.fb.array(this.details.map(accountDetail => this.fb.group({
        workflowAccountDetailPk: this.fb.control(accountDetail.workflowAccountDetailPk),
        amountMin: this.fb.control(accountDetail.amountMin),
        amountMax: this.fb.control(accountDetail.amountMax),
        l1: this.fb.control(accountDetail.levels[0]),
        l2: this.fb.control(accountDetail.levels[1]),
        l3: this.fb.control(accountDetail.levels[2]),
        l4: this.fb.control(accountDetail.levels[3]),
        l5: this.fb.control(accountDetail.levels[4]),
      })));
      this.detailsList.disable();
    }
    console.log('detail',this.detailsList);
    // this.form = this.fb.group({
    //   array: this.detailsList
    // });
  }
}
