import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { ModelPipe } from '../../../../../Components/common/Pipes/model-pipe'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { ManageOLPRefundEntityService } from '../refund-sadad-olp-entity.service'
import {
  searchFormDateFromValidators,
  searchFormDateToValidators,
} from './olp-refund-list.searchformdates.validator'
import { OLPRefundListService } from './olp-refunds-list.service'

@Component({
  selector: 'app-olp-refunds-list',
  templateUrl: './olp-refunds-list.component.html',
  styleUrls: ['./olp-refunds-list.component.scss'],
})
export class OLPRefundListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  refundStatusSelect: any[] = []
  initiatorTypeSelect: any[] = []
  listTitle: string
  bsConfig: any
  @ViewChild('searchablePanelComponent', { read: ElementRef })
  searchAblePanelComponent: ElementRef
  searchButton: any
  selectAllOnPage: any = []

  constructor(
    public fb: FormBuilder,
    public service: OLPRefundListService,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    private serviceData: ManageOLPRefundEntityService,
    public router: Router,
    private modelPipe: ModelPipe,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'refundID'
    this.orderType = 'desc'

    this.searchForm = this.fb.group({
      transactionId: ['', [Validators.minLength(20), Validators.maxLength(30)]],
      refundId: [],
      dateFrom: ['', [searchFormDateFromValidators]],
      dateTo: ['', [searchFormDateToValidators]],
      refundStatus: [],
      initiatorType: [],
    })

    this.searchForm.statusChanges.subscribe((values) => {
      this.searchButton.disabled = values === 'INVALID'
    })
  }

  refreshData() {
    const combosSolicitados = ['sadadOLPRefundsStatus', 'olpRefundInitiators']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.refundStatusSelect = this.staticRecoverValues(
          combosSolicitados,
          data,
          'sadadOLPRefundsStatus',
        )
        const index = Object.keys(
          data[combosSolicitados.indexOf('olpRefundInitiators')]['values'],
        ).sort(function (a, b) {
          return data[combosSolicitados.indexOf('olpRefundInitiators')][
            'values'
          ][a] >
            data[combosSolicitados.indexOf('olpRefundInitiators')]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf('olpRefundInitiators')]['values'][
                b
              ] >
              data[combosSolicitados.indexOf('olpRefundInitiators')]['values'][
                a
              ]
            ? -1
            : 0
        })
        for (let i = 1; i < index.length; i++) {
          if (
            data[combosSolicitados.indexOf('olpRefundInitiators')].values[i]
          ) {
            this.initiatorTypeSelect.push({
              key: index[i],
              value:
                data[combosSolicitados.indexOf('olpRefundInitiators')][
                  'values'
                ][index[i]],
            })
          }
        }

        const toTranslate = 'sadadOLP.refunds.list'
        this.subscriptions.push(
          this.translate.get(toTranslate).subscribe((title) => {
            this.listTitle =
              title +
              ' ' +
              data[combosSolicitados.indexOf('olpRefundInitiators')][
                'values'
              ][2]
          }),
        )
      })
  }

  getId(row) {
    return row['refundID']
  }

  onChangeInitiator(event: Event) {
    const selectElementText =
      event.target['options'][event.target['options'].selectedIndex].text

    const toTranslate = 'sadadOLP.refunds.list'
    this.subscriptions.push(
      this.translate.get(toTranslate).subscribe((title) => {
        this.listTitle = title + ' ' + selectElementText
      }),
    )
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
            result.data.forEach((element) => {
              element['statusForPrint'] = this.modelPipe.transform(
                'sadadOLPRefundsStatus',
                element['status'],
              )
            })
          }
        }),
    )
  }

  // onSelect({ selected }) {
  //     this.tableSelectedRows = [];
  //     this.tableSelectedRows.splice(0, selected.length);
  //     this.tableSelectedRows.push(...selected);
  //     this.serviceData.setSelectedData(this.tableSelectedRows);
  //     return this.tableSelectedRows;
  // }

  onSelect({ selected }) {
    // Make sure we are no longer selecting all
    //console.log('---select one---');
    //
    if (typeof selected != 'undefined') {
      this.selectAllOnPage[this.elementsPage.page.pageNumber] = false
      this.tableSelectedRows.splice(0, this.tableSelectedRows.length)
      this.tableSelectedRows.push(...selected)
      this.serviceData.setSelectedData(this.tableSelectedRows)
      return this.tableSelectedRows
    }
  }

  selectAll() {
    if (!this.selectAllOnPage[this.elementsPage.page.pageNumber]) {
      // Unselect all so we dont get duplicates.
      if (this.tableSelectedRows.length > 0) {
        this.elementsPage.data.map((item) => {
          this.tableSelectedRows = this.tableSelectedRows.filter(
            (selected) => this.getId(selected) !== this.getId(item),
          )
        })
      }
      // Select all again
      this.tableSelectedRows.push(...this.elementsPage.data)
      this.selectAllOnPage[this.elementsPage.page.pageNumber] = true
      //console.log('-----------Select All----');
      //console.log(tableSelected);
    } else {
      // Unselect all
      this.elementsPage.data.map((item) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(item),
        )
      })
      this.selectAllOnPage[this.elementsPage.page.pageNumber] = false
      //console.log('-----------UnSelect All');
      //console.log(tableSelected)
    }
    //console.log('---alll--action');
    //
    this.serviceData.setSelectedData(this.tableSelectedRows)
  }

  displayCheck(row) {
    return row.status == '1'
  }

  ngOnInit() {
    super.ngOnInit()
    this.search()
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  ngAfterViewInit() {
    this.searchButton =
      this.searchAblePanelComponent.nativeElement.getElementsByClassName(
        'btn-primary',
      )[0]
  }
}
