import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'sme-card-media',
  templateUrl: './sme-card-media.component.html',
  styleUrls: ['./sme-card-media.component.scss'],
})
export class SmeCardMediaComponent implements OnInit {
  @Input() showEndArraw?: boolean = false
  @Input() mediaBorder?: boolean = false
  constructor() {}

  ngOnInit(): void {}
}
