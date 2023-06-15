import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  step = 3
  sharedData: any = {}

  constructor(private router: Router) {}

  ngOnInit(): void {}

  finish() {
    this.router.navigate(['/myprofile/pending/transfers/step1'])
  }
}
