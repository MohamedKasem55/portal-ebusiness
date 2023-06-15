import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PayrollsService } from '../../payrolls.service'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  step = 3
  sharedData: any = {}

  constructor(private router: Router, public service: PayrollsService) {}

  ngOnInit(): void {}

  finish() {
    this.service.resultReferenceFile = []
    this.router.navigate(['/myprofile/pending/payroll/step1'])
  }
}
