import { element } from 'protractor';
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { AbstractDatatableMobileComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-datatable-mobile.component'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { take } from 'rxjs/operators'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../../Model/paged-data'
import { DepositorOriginator } from '../../Model/depositor-originator'
import { BeneficiaryOriginatorService } from '../../Services/beneficiary-originator/beneficiary-originator.service'

@Component({
  selector: 'app-beneficiary-originator',
  templateUrl:
    '../../View/beneficiary-originator/beneficiary-originator.component.html',
})
export class BeneficiaryOriginatorComponent
  extends AbstractDatatableMobileComponent
  implements OnInit {
  @ViewChild('table', { static: true }) table: DatatableComponent
  searchForm: FormGroup
  selectedRowsOriginals: any[] = [];
  elementsChanged: any[] = [];
  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public service: BeneficiaryOriginatorService,
    public router: Router,
    public authenticationService: AuthenticationService,
  ) {
    super(fb, translate, authenticationService, router)
    this.searchForm = this.fb.group({
      chapter: [''],
      branch: [''],
      division: [''],
      selected: [''],
    })
  }

  ngOnInit() {
    super.ngOnInit()
    this.setPage({ offset: 0 })
  }

  getAllTables(): any[] {
    return Array.of(this.table)
  }


  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service.getList(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
            this.elementsPage.data.forEach((item) => {
              if (item.checked) {
                const exist = this.selectedRowsOriginals.some(
                  (x) => x.govRevenueDepositorsPk == item.govRevenueDepositorsPk,
                )
                if (!exist) {
                  this.selectedRowsOriginals.push(item);
                }
                const changed = this.elementsChanged.some(
                  (x) => x.govRevenueDepositorsPk == item.govRevenueDepositorsPk,
                )
                if (!changed && !exist) {
                  this.tableSelectedRows.push(item);
                }
              }
            })
            this.checkIfAllAreSelected();
          }
        }),
    )
  }

  public updateElementChanges() {
    this.elementsChanged = [];
    this.selectedRowsOriginals.forEach((originalData) => {
      const find = this.tableSelectedRows.find((selected) => (selected.govRevenueDepositorsPk === originalData.govRevenueDepositorsPk))
      if (!find) {
        this.elementsChanged.push(originalData);
      }
    });
    this.tableSelectedRows.forEach((selected) => {
      const find = this.selectedRowsOriginals.find((originalData) => (originalData.govRevenueDepositorsPk === selected.govRevenueDepositorsPk))
      if (!find) {
        this.elementsChanged.push(selected);
      }
    });
  }

  checkIfAllAreSelected(): void {
    // check if all allowed items are selected on current page
    super.checkIfAllAreSelected()
    this.updateElementChanges()
  }

  getId(row) {
    return row['govRevenueDepositorsPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  reset() {
    this.searchForm.reset()
    this.setPage(null)
  }

  confirmModify() {
    const copyChanged = [];

    this.updateElementChanges()
    this.elementsChanged.forEach((e) => {
      const modifiedCopy = { ...e };
      modifiedCopy.checked = !modifiedCopy.checked;
      copyChanged.push(modifiedCopy)
    })
    // pass a copy with the diferents
    this.service.pushModifiedBeneficiaries(
      copyChanged,
    )
    this.router.navigate([
      '/companyadmin/accounts/beneficiary-originators/confirm',
    ])
  }

  public getElementsPage() {
    return this.elementsPage;
  }
}
