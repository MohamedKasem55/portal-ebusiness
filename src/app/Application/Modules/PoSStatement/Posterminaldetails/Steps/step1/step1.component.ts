import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../../Common/Services/static.service'

@Component({
  selector: 'app-update-cards-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit {
  @Input() form: FormGroup
  @Input() batch: any
  @Output() onInit = new EventEmitter<Component>()
  cities: any = []
  model: any
  city
  constructor(
    private injector: Injector,
    public staticService: StaticService,
    public translate: TranslateService,
  ) {
    this.model = {
      city: '',
    }
  }

  ngOnInit() {
    const combosSolicitados = ['cityType']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        //console.log(data[combosSolicitados.indexOf("cityType")]);
        this.cities = []
        const index = Object.keys(
          data[combosSolicitados.indexOf('cityType')]['values'],
        ).sort((a, b) => {
          //console.log(a,b);
          return data[combosSolicitados.indexOf('cityType')]['values'][a] >
            data[combosSolicitados.indexOf('cityType')]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf('cityType')]['values'][b] >
              data[combosSolicitados.indexOf('cityType')]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index.length; i++) {
          this.cities.push({
            key: index[i],
            value:
              data[combosSolicitados.indexOf('cityType')]['values'][index[i]],
          })
        }
      })

    this.onInit.emit(this as Component)

    this.form.disable()
  }

  onChangeCity(cityCode): void {
    if (cityCode) {
      this.city = cityCode.target
    }
    this.form.controls.city.setValue(this.city)
    //console.log(this.city);
  }
  /*ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }*/
}
