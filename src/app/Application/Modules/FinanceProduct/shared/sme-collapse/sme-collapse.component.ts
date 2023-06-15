import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'arb-sme-collapse',
  templateUrl: './sme-collapse.component.html',
  styleUrls: ['./sme-collapse.component.scss'],
})
export class SmeCollapseComponent implements OnInit {
  show: boolean = false
  constructor() {}

  ngOnInit(): void {}
}
