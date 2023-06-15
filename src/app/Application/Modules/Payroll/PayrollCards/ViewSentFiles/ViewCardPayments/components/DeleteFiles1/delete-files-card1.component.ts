import { Component, OnInit, ViewChild } from '@angular/core'
import { NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../../../../core/storage/storage.service'
import { ViewSentFilesService } from '../../../view-sent-files.service'

@Component({
  templateUrl: './delete-files-card1.component.html',
})
export class DeleteFilesCard1Component
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('table', { static: true }) table: any
  @ViewChild('stepForm') stepForm: NgForm

  step = 1

  sharedData: any = {}
  getviewSentFilesSubscription: Subscription
  viewCardPaymentsResults: any = {}
  tableDisplaySize = 20
  companyName: any
  companyCIC: any
  /*//Temporal Mock
    mockData = [ {
        batchName: "File name uploaded 1",
        dataReceived: "2017-10-16T10:23:19.133Z",
        dirUploadArchive: true,
        fileName: "fileNameUploaded1",
        fileSize: 0,
        userFileName: "fileNameUploaded_1"

    },
    {
        batchName: "File name uploaded 2",
        dataReceived: "2017-10-16T10:23:19.133Z",
        dirUploadArchive: true,
        fileName: "fileNameUploaded2",
        fileSize: 0,
        userFileName: "fileNameUploaded_2"
    }
    ]*/

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

    this.viewCardPaymentsResults.fileDTOList = []
    this.viewCardPaymentsResults.size = 0
    this.viewCardPaymentsResults.total = 0

    this.sharedData.tableSelected = []

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
      .getCardPayments(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        //console.log("Card Files: "+JSON.stringify(result));
        if (!result.error) {
          this.viewCardPaymentsResults = result.outputFilePagination
        }
        this.getviewSentFilesSubscription.unsubscribe()
      })
  }

  onSelect({ selected }) {
    //Datos seleccionados
    //console.log('Select Event', selected, this.sharedData.tableSelected);
    this.sharedData.tableSelected.splice(
      0,
      this.sharedData.tableSelected.length,
    )
    this.sharedData.tableSelected.push(...selected)
  }

  detail(element) {
    this.sharedData.selectedFile = element
    this.router.navigate([
      '/payroll/payroll-cards/view-sent-files/view-card-payments/details-uploaded-files',
    ])
  }

  getId(row) {
    return row['fileName']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }
}
