import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  templateUrl: './step3.component.html',
})
export class Step3Component implements OnInit {
  step = 3
  sharedData: any = {}

  constructor(private router: Router) {}

  ngOnInit(): void {
    //console.log("sharedData", this.sharedData);
  }

  finish() {
    this.router.navigate(['/myprofile/pending/moi-payments/step1'])
  }

  hasFileReferenceSP() {
    return (
      this.sharedData['confirmResponse']['fileReferenceSP'] &&
      this.sharedData['confirmResponse']['fileReferenceSP'] != null &&
      this.sharedData['confirmResponse']['fileReferenceSP'] != undefined &&
      this.sharedData['confirmResponse']['fileReferenceSP'] != ''
    )
  }

  hasFileReferenceSR() {
    return (
      this.sharedData['confirmResponse']['fileReferenceSR'] &&
      this.sharedData['confirmResponse']['fileReferenceSR'] != null &&
      this.sharedData['confirmResponse']['fileReferenceSR'] != undefined &&
      this.sharedData['confirmResponse']['fileReferenceSR'] != ''
    )
  }
}
