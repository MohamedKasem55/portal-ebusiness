import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewChecked,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'

@Component({
  templateUrl: './step3.component.html',
  styles: [
    `
      @media screen and (max-width: 800px) {
        .desktop-hidden {
          display: initial;
        }
        .mobile-hidden {
          display: none;
          width: 0%;
        }
      }
      @media screen and (min-width: 800px) {
        .desktop-hidden {
          display: none;
        }
        .mobile-hidden {
          display: initial;
        }
      }
    `,
  ],
})
export class Step3Component
  extends DatatableMobileComponent
  implements OnInit, AfterViewChecked
{
  @ViewChild('withinTable') tableAlrajhi: any
  @ViewChild('localTable') tableLocal: any
  @ViewChild('internationalTable') tableInternational: any

  step = 3
  sharedData: any = {}
  public innerWidth: any
  public mobile = false

  withinDisplaySize = 20
  localDisplaySize = 20
  internationalDisplaySize = 20

  constructor(public router: Router, public translate: TranslateService) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    if (this.tableAlrajhi) {
      tablas.push(this.tableAlrajhi)
    }
    if (this.tableLocal) {
      tablas.push(this.tableLocal)
    }
    if (this.tableInternational) {
      tablas.push(this.tableInternational)
    }
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
  }
  onDetailToggle(event) {
    //console.log('Detail Toggled', event);
  }

  finish() {
    this.router.navigate(['/myprofile/pending/beneficiaries/step1'])
  }
}
