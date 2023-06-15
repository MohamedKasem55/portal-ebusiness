import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'sme-range-slider',
  templateUrl: './sme-range-slider.component.html',
  styleUrls: ['./sme-range-slider.component.scss'],
})
export class SmeRangeSliderComponent implements OnInit {
  @Input() sliderHeaderStart: string = ''
  @Input() sliderHeaderEnd: string = ''
  @Input() sliderFooterEnd: string = ''
  @Input() min: number = 0
  @Input() max: number = 100
  @Input() step: number = 1
  @Output() sliderValue: EventEmitter<number> = new EventEmitter()

  constructor() {}
  ngOnInit(): void {}

  getValue(event) {
    this.sliderValue.emit(event.target.value)
  }
}
