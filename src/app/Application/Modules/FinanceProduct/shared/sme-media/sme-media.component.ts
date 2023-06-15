import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'sme-media',
  templateUrl: './sme-media.component.html',
  styleUrls: ['./sme-media.component.scss'],
})
export class SmeMediaComponent implements OnInit {
  @Input() showEndArraw?: boolean = false
  @Input() mediaBorder?: boolean = false
  constructor() {}

  ngOnInit(): void {}
}
