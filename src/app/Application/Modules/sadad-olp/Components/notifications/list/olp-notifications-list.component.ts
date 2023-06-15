import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { PagedData } from '../../../../../Model/paged-data'
import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { StaticService } from '../../../../Common/Services/static.service'
import { ManageOLPNotificationEntityService } from '../olp-notifications-entity.service'
import { OLPNotificationsListService } from './olp-notifications-list.service'

@Component({
  selector: 'app-notifications-list-form',
  templateUrl: './olp-notifications-list.component.html',
  styleUrls: ['./olp-notifications-list.component.scss'],
})
export class OLPNotificationsListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('elementsTable', { static: true }) elementsTable: any
  actionTypeSelect: any[] = []
  referenceTypeSelect: any[] = []
  @Input() mainList: boolean = true
  selectAllOnPage: any = []
  bsConfig: any

  constructor(
    public fb: FormBuilder,
    public service: OLPNotificationsListService,
    public translate: TranslateService,
    public staticService: StaticService,
    private serviceData: ManageOLPNotificationEntityService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'notificationDate'
    this.orderType = 'desc'

    this.searchForm = this.fb.group({
      actionType: [],
      referenceType: [],
      dateFrom: [''],
      dateTo: [''],
    })
  }

  getId(row) {
    return row['ntfId'] + row['taskId']
  }
  getAllTables(): any[] {
    const tablas = []
    if (this.elementsTable) {
      tablas.push(this.elementsTable)
    }

    return tablas
  }
  refreshData() {
    const combosSolicitados = [
      'sadadOLPNotificationsActionType',
      'sadadOLPNotificationsReferenceType',
    ]
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.actionTypeSelect = this.staticRecoverValues(
          combosSolicitados,
          data,
          'sadadOLPNotificationsActionType',
        )
        const index = Object.keys(
          data[combosSolicitados.indexOf('sadadOLPNotificationsReferenceType')][
            'values'
          ],
        ).sort(function (a, b) {
          return data[
            combosSolicitados.indexOf('sadadOLPNotificationsReferenceType')
          ]['values'][a] >
            data[
              combosSolicitados.indexOf('sadadOLPNotificationsReferenceType')
            ]['values'][b]
            ? 1
            : data[
                combosSolicitados.indexOf('sadadOLPNotificationsReferenceType')
              ]['values'][b] >
              data[
                combosSolicitados.indexOf('sadadOLPNotificationsReferenceType')
              ]['values'][a]
            ? -1
            : 0
        })
        for (let i = 1; i < index.length; i++) {
          if (
            data[
              combosSolicitados.indexOf('sadadOLPNotificationsReferenceType')
            ].values[i]
          ) {
            this.referenceTypeSelect.push({
              key: index[i],
              value:
                data[
                  combosSolicitados.indexOf(
                    'sadadOLPNotificationsReferenceType',
                  )
                ]['values'][index[i]],
            })
          }
        }
      })
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    if (this.mainList || this.serviceData.getData() != null) {
      this.subscriptions.push(
        this.service
          .getResults(searchElement, order, orderType, offset, pageSize)
          .subscribe((result) => {
            if (result === null) {
              this.onError(result)
            } else {
              this.elementsPage = result
            }
          }),
      )
    } else {
      var elements = new PagedData<any>()
      elements.data = this.serviceData.getSelectedData()
      elements.page.pageNumber = this.serviceData.getSelectedData().length
      elements.page.size = this.serviceData.getSelectedData().length
      elements.page.pageSize = this.serviceData.getSelectedData().length
      elements.page.totalElements = this.serviceData.getSelectedData().length
      elements.page.totalPages = 20

      this.elementsPage = elements
    }
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

  selectAll(event) {
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
      //console.log( this.tableSelectedRows);
    } else {
      // Unselect all
      this.elementsPage.data.map((item) => {
        this.tableSelectedRows = this.tableSelectedRows.filter(
          (selected) => this.getId(selected) !== this.getId(item),
        )
      })
      this.selectAllOnPage[this.elementsPage.page.pageNumber] = false
      //console.log('-----------UnSelect All');
      //console.log( this.tableSelectedRows)
    }
    this.serviceData.setSelectedData(this.tableSelectedRows)
    return this.tableSelectedRows
  }

  ngOnInit() {
    super.ngOnInit()
    //console.log(this.mainList);
    this.search()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
}
