import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-national-address-step2',
  templateUrl:
    '../../View/national-address/national-address-step2.component.html',
})
export class NationalAddressStep2Component implements OnInit {
  @Input() formNational: FormGroup
  @Input() regions: any[]
  @Input() cities: any[]
  @Output() onInit = new EventEmitter<any>()

  constructor(public fb: FormBuilder) {}

  getRegion(region) {
    for (let i = 0; i < this.regions.length; ++i) {
      if (this.regions[i].key == region) {
        return this.regions[i].value
      }
    }
  }

  getCity(city) {
    for (let i = 0; i < this.cities.length; ++i) {
      if (this.cities[i].key == city) {
        return this.cities[i].value
      }
    }
  }
  ngOnInit() {
    this.onInit.emit(this)
  }
}
