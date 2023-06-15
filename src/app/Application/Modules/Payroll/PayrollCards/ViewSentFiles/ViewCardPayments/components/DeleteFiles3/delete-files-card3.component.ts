import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ViewSentFilesService } from '../../../view-sent-files.service'

@Component({
  templateUrl: './delete-files-card3.component.html',
})
export class DeleteFilesCard3Component implements OnInit {
  step = 3
  sharedData: any = {}

  constructor(private service: ViewSentFilesService, private router: Router) {}

  ngOnInit(): void {
    this.sharedData.requestValidate = {}
  }
}
