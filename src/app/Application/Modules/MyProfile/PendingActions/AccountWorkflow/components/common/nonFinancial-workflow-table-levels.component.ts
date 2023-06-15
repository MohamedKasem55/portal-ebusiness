import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Component({
  selector: 'app-nonFinancial-table-levels',
  templateUrl: './nonFinancial-workflow-table-levels.component.html',
  styleUrls: ['./nonFinancial-workflow-table-levels.component.scss'],
})
export class NonFinancialWorkflowTableLevelsComponent implements OnInit {
  @Input() levels: any = [false,false,false,false,false];
  @Input() isMobile: boolean = false;

  form: FormGroup

  constructor(public translate: TranslateService, public fb: FormBuilder) {
    this.form = this.fb.group({
      l1: null,
      l2: null,
      l3: null,
      l4: null,
      l5: null,
    })
  }

  ngOnInit(): void {
    this.form.disable();
    if (this.levels) {
      this.form.patchValue({
        l1: this.levels[0],
        l2: this.levels[1],
        l3: this.levels[2],
        l4: this.levels[3],
        l5: this.levels[4],
      })
    }
  }

}
