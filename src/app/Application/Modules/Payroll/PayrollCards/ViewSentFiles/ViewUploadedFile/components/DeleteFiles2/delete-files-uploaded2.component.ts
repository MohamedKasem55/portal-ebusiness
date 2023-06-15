import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { ViewSentFilesService } from '../../../view-sent-files.service'

@Component({
  templateUrl: './delete-files-uploaded2.component.html',
})
export class DeleteFilesUploaded2Component implements OnInit {
  step = 2
  sharedData: any = {}
  deleteviewSentFilesSubscription: Subscription

  constructor(private service: ViewSentFilesService, private router: Router) {}

  ngOnInit(): void {}

  deleteFiles(i) {
    this.sharedData.tableSelected.splice(i, 1)
  }
}
