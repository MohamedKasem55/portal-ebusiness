import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
    selector: 'exist-application',
    templateUrl: './exist-application.component.html',
    styleUrls: ['./exist-application.component.scss']
})
export class ExistApplicationComponent implements OnInit {
  public dossierID: string;

  constructor(public activeRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(param => {
      this.dossierID = param.dossierID
    })
  }
}
