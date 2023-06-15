import { Component, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../../../../core/storage/storage.service'
import { ViewSentFilesService } from '../../../view-sent-files.service'

@Component({
  templateUrl: './delete-files-uploaded1.component.html',
})
export class DeleteFilesUploadedComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any
  @ViewChild('stepForm') stepForm: NgForm
  sharedData: any = {}
  step = 1

  tableSelected: any = []

  getviewSentFilesSubscription: Subscription
  viewSentFilesResults: any = {}
  tableDisplaySize = 20
  companyName: any
  companyCIC: any

  constructor(
    private viewSentFilesService: ViewSentFilesService,
    private router: Router,
    public translate: TranslateService,
    private storage: StorageService,
  ) {
    super()
    this.companyName = JSON.parse(storage.retrieve('currentUser'))['company'][
      'companyName'
    ]
    this.companyCIC = JSON.parse(storage.retrieve('currentUser'))['company'][
      'profileNumber'
    ]
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit(): void {
    super.ngOnInit()
    this.viewSentFilesResults.fileDTOList = []
    this.viewSentFilesResults.size = 0
    this.viewSentFilesResults.total = 0

    //this.sharedData.tableSelected=[];

    /*  //Borrar cuando el servicio tenga datos.
          this.viewSentFilesResults.size=2;
          this.viewSentFilesResults.total=2;*/

    this.setPage(null)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.getviewSentFilesSubscription = this.viewSentFilesService
      .getUploadedFiles(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.viewSentFilesResults = result.outputFilePagination
        }
        this.getviewSentFilesSubscription.unsubscribe()
      })
  }

  onSelect({ selected }) {
    this.tableSelected = []
    this.tableSelected.splice(0, this.tableSelected.length)
    this.tableSelected.push(...selected)
    //console.log("Row seleccionadas");
    this.sharedData.tableSelected = this.tableSelected
    //console.log(this.sharedData.tableSelected);
  }

  detail(element) {
    this.sharedData.selectedFile = element
    this.router.navigate([
      '/payroll/payroll-cards/view-sent-files/view-uploaded-files/details-uploaded-files',
    ])
  }

  getId(row) {
    return row['fileName']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
