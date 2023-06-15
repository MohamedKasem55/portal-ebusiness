import { Location } from '@angular/common'
import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { PagedData } from '../../../../Model/paged-data'
import { ModelServiceMoiFeedBackFilesList } from '../Model/moi-feedback-files-list-service.model'
// Service to GET list of payments orders
import { FeedBackFiles } from '../Services/feedback-files-list.service'
import { ModelPipe } from '../../../../Components/common/Pipes/model-pipe'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  templateUrl: './feedback-files-details.component.html',
})
export class MOIFeedBackFilesDetailComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('downloadedFiles', { static: true }) table: any

  feedBackFilesListPage: PagedData<ModelServiceMoiFeedBackFilesList>
  feedBackFilesInProcess: PagedData<ModelServiceMoiFeedBackFilesList>

  combosData: any = {}

  constructor(
    private feedBackFiles: FeedBackFiles,
    private _location: Location,
    public translate: TranslateService,
    public router: Router,
    private staticService: StaticService,
  ) {
    super()
    this.feedBackFilesListPage =
      new PagedData<ModelServiceMoiFeedBackFilesList>()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  public setPageFeedBackDetailPages(dataTableEvent) {
    //console.log("Llamada");

    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    const fileName = this.feedBackFiles.getFileName()

    if (!fileName) {
      this.goBack()
      return
    }

    const combosKeys = [
      'errors',
      'eGovSadadType',
      'eGovProcess',
      'eGovSadadRefundStatus',
    ]

    this.staticService.getAllCombos(combosKeys).subscribe((resultC) => {
      if (resultC === null) {
        this.onError(resultC)
      } else {
        const data: Object = resultC
        for (let i = 0; i < combosKeys.length; i++) {
          this.combosData[combosKeys[i]] =
            data[combosKeys.indexOf(combosKeys[i])]['values']
        }

        // Service Call
        this.feedBackFiles.details(fileName).subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            if (result.errorCode && result.errorCode === '0') {
              this.feedBackFilesListPage = new PagedData()
              this.feedBackFilesListPage.page.totalElements =
                result.egovSadadDetailsOutputDTO.linesGovSadadFilesList.length
              if (
                result.egovSadadDetailsOutputDTO.linesGovSadadFilesList.length /
                  this.feedBackFilesListPage.page.pageSize >=
                1
              ) {
                this.feedBackFilesListPage.page.totalPages =
                  result.egovSadadDetailsOutputDTO.linesGovSadadFilesList
                    .length / this.feedBackFilesListPage.page.pageSize
                this.feedBackFilesListPage.page.size =
                  this.feedBackFilesListPage.page.pageSize
              } else {
                this.feedBackFilesListPage.page.pageSize =
                  result.egovSadadDetailsOutputDTO.linesGovSadadFilesList.length
                this.feedBackFilesListPage.page.totalPages = 1
                this.feedBackFilesListPage.page.size =
                  result.egovSadadDetailsOutputDTO.linesGovSadadFilesList.length
              }
              this.feedBackFilesListPage.data =
                result.egovSadadDetailsOutputDTO.linesGovSadadFilesList

              //console.log("this.combosData['errors']", this.combosData);

              this.feedBackFilesListPage.data.forEach((item) => {
                item['accountNumberPrint'] = item['dbDetails'].accountNumber
                item['beneficiaryNamePrint'] = item['dbDetails'].beneficiaryName
                item['civilianId'] = item['refundId'].substr(8, 18)
                item['civilianIdPrint'] = this.extractCivilianIdFromRefoundId(
                  item['dbDetails'],
                )
                item['typePrint'] = item['dbDetails']['serviceType']
                  ? this.combosData['eGovSadadType'][
                      item['dbDetails']['serviceType']
                    ]
                  : ''
                item['processPrint'] = item['recordType']
                  ? this.combosData['eGovProcess'][item['recordType']]
                  : ''
                item['refundStatusPrint'] = item['refundStatus']
                  ? this.combosData['eGovSadadRefundStatus'][
                      item['refundStatus']
                    ]
                  : ''
                if (
                  item['returnCode'] == '000' &&
                  item['sadadErrorCode'] != '' &&
                  item['sadadErrorCode'] != null &&
                  item['sadadErrorCode'] != undefined &&
                  item['sadadErrorCode'] != '000000'
                ) {
                  item['resultTxt'] = item['errorDescription']
                    ? [item['errorDescription']]
                    : ''
                } else {
                  item['resultTxt'] = item['returnCode']
                    ? this.combosData['errors'][
                        'errorTable.' + item['returnCode']
                      ]
                    : ''
                }
              })
            }
          }
        })
      }
    })
  }

  public setSortPayments(dataTableEvent) {
    /*
            if ( dataTableEvent.sorts[0] ) {
                    this.order = dataTableEvent.sorts[0].prop;
                    this.orderType = dataTableEvent.sorts[0].dir;
                }

                this.accountBalancePage.page.pageNumber = 1;
                this.loading = true;

                // Service Call with new short
                this.service.getResults(this.order, this.orderType, dataTableEvent.offset + 1, this.accountBalancePage.page.pageSize)
                    .subscribe( result => {
                        if ( result === null ) {
                            this.onError(result);
                        } else {
                            this.loading = false;
                            this.accountBalancePage=result;
                        }
                    });
        */
  }

  onError(result) {}

  ngOnInit() {
    super.ngOnInit()
    this.setPageFeedBackDetailPages({ offset: 0 })
  }

  extractCivilianIdFromRefoundId(dbDetails): string {
    //console.log(dbDetails.details);
    let civiliandId = ''
    if (dbDetails.details) {
      for (let index = 0; index < dbDetails.details.length; index++) {
        const element = dbDetails.details[index]
        if (
          element.labelKey.endsWith('iqamaId') ||
          element.labelKey.endsWith('beneficiaryId') ||
          element.labelKey.endsWith('sponsorId') ||
          element.labelKey.endsWith('citizenId')
        ) {
          civiliandId = element.value
        }
      }
    }

    return civiliandId
  }

  goBack() {
    this.router.navigate(['/payments/moi/feedback-files'])
  }

  isPaymentType() {
    return (
      this.feedBackFilesListPage &&
      this.feedBackFilesListPage.data &&
      this.feedBackFilesListPage.data[0] &&
      this.feedBackFilesListPage.data[0]['recordType'] == 'P'
    )
  }

  isRefundType() {
    return (
      this.feedBackFilesListPage &&
      this.feedBackFilesListPage.data &&
      this.feedBackFilesListPage.data[0] &&
      this.feedBackFilesListPage.data[0]['recordType'] == 'R'
    )
  }
}
