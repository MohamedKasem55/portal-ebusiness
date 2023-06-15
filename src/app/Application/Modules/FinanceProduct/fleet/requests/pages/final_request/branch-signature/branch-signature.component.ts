import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { FinanceFleetNewReqService } from 'app/Application/Modules/FinanceProduct/fleet//requests/fleet-finance.service'
import { Subject, Subscription } from 'rxjs'
import {
  debounceTime,
  switchMap,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs/operators'
import { PagedData } from 'app/Application/Model/paged-data'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { Location } from '@angular/common'
export interface PageSize {
  pageSize: number
  offset: number
}

@Component({
  selector: 'branch-signature',
  templateUrl: './branch-signature.component.html',
  styleUrls: ['./branch-signature.component.scss'],
})
export class BranchSignatureComponent
  extends DatatableMobileComponent
  implements OnInit
{
  breadcrumbList: Breadcrumb[] = []
  wizardSteps: string[] = []
  branchesPages: any
  currentWizStep: number = 1
  pageSize: number = 5
  searchSubscription?: Subscription
  searchSubject = new Subject<string>()
  rows: PagedData<any>
  selected: any[] = []
  destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(
    private translate: TranslateService,
    private fleetServ: FinanceFleetNewReqService,
    private location: Location,
    private router: Router,
  ) {
    super()
    this.rows = new PagedData<any>()
  }

  ngOnInit(): void {
    this.prepareData()
    this.search()
    this.getAllBranches({
      pageSize: this.pageSize,
      offset: 0,
    })
  }

  // get data for breadcrumb and wizard
  prepareData(): void {
    this.translate.get('fleet').subscribe((data) => {
      this.prepareBreadCrump(data)
      this.prepareWizzard(data)
    })
  }

  //  made search request after 600 ms
  search(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(600),
        distinctUntilChanged(),
        switchMap((searchVal) => this.fleetServ.searchPost(searchVal)),
      )
      .subscribe((results) => {})
  }

  // assign search value to subject value
  onSearch(event: Event): void {
    this.searchSubject.next((event.target as HTMLInputElement).value?.trim())
  }

  // get table data from service
  getAllBranches(page: PageSize): void {
    this.fleetServ
      .getAllBranches(page)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: any) => {
          // assign data and pages
          this.rows.data = data.data
          this.pageSize = data.page.pageSize
          this.rows.page.pageSize = this.pageSize
          this.rows.page.pageNumber = data.page.pageNumber
          this.rows.page.size = data.page.size
          this.rows.page.totalPages = data.page.totalPages
          this.rows.page.totalElements = data.page.total
        },
        (err) => {
        },
        () => {},
      )
  }

  //set page
  setPage(page: PageSize) {
    this.getAllBranches(page)
  }

  // get id
  getId(row: string) {
    return (
      String(row['branchId']) +
      String(row['branchName']) +
      String(row['branchCity']) +
      String(row['branchCode'])
    )
  }

  // get row Identity
  getIdFunction() {
    return this.getId.bind(this)
  }

  //  change page size
  setPageSize(size) {
    this.pageSize = size
    const page = {
      pageSize: size,
      offset: 0,
    }

    this.setPage(page)
  }

  // selected rows
  onSelect(event) {
    this.selected = [...event.selected]
  }
  // destroy component
  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  navigateTo(target) {
    target === 'back' ? this.location.back() : this.router.navigateByUrl[target]
  }

  prepareBreadCrump(data: any): void {
    this.breadcrumbList = [
      {
        txt: data.offerAcceptance.finance,
        active: false,
        router: '',
      },
      {
        txt: data.offerAcceptance.fleetFinance,
        active: false,
        router: '',
      },
      {
        txt: data.offerSignature.branchSignature,
        active: true,
        router: '',
      },
    ]
  }
  prepareWizzard(data: any): void {
    this.wizardSteps = [
      data.offerSignature.wizzardStep.selectOffice,
      data.offerSignature.wizzardStep.summary,
      data.offerSignature.wizzardStep.finish,
    ]
  }
}
