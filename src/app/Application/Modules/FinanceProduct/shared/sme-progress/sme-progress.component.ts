import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'sme-progress',
  templateUrl: './sme-progress.component.html',
  styleUrls: ['./sme-progress.component.scss'],
})
export class SmeProgressComponent implements OnInit {
  @Input() topTitle: string = '';
  @Input() downTitle: string = '';
  @Input() percentage: any;
  @Input() totalLimit: any;
  @Input() remainingLimit: any;

  constructor() {}
  ngOnInit(): void {}
}
