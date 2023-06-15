import { Component, Injector, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subject, Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'
import { HajjUmrahService } from '../../Hajj-Umrah.service'
import { ModelPipe } from '../../../../../../Components/common/Pipes/model-pipe'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  @ViewChild('table', { static: true }) table: any
  @ViewChild('tableAllocations', { static: true }) tableAllocations: any

  step = 1
  sharedData: any = {}
  pendingSubscriptions: Subscription
  pendingAllocSubscriptions: Subscription
  router: any
  currentComponent: any
  pageResult: any = {}
  pageResultAllocation: any = {}
  tableDisplaySize = 20
  authorizeSubscription: Subscription
  operation: any
  visaNumber: any
  cardNumber: any
  orderType: any
  searchCategory: string
  passportNumber: any
  request: any
  HajjUmrahService: any
  searchList: any
  visa: any
  status: any

  tableToEmpty: Subject<string> = new Subject()

  constructor(
    private service: HajjUmrahService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public levelFormatPipe: LevelFormatPipe,
    private injector: Injector,
    public modelPipe: ModelPipe,
  ) {}

  ngOnInit(): void {
    this.pageResult.items = []
    this.pageResult.size = 0
    this.pageResult.total = 0

    this.pageResultAllocation.items = []
    this.pageResultAllocation.size = 0
    this.pageResultAllocation.total = 0

    this.sharedData.selected = []
    this.sharedData.allocationsSelected = []

    this.modelPipe.transform('hajjUmrahcardsOperations', '__KEY_VALUE_LIST__')
    this.setPage(null)
  }

  clearTable(element) {
    const items = Object.assign([], element.items)
    element.items = []
    element.items.push(...items)
  }

  setPage(pageInfo) {
    // if (pageInfo == null) {
    //     pageInfo = { offset: 0 }
    // }

    let request = {
      cardNumber: null,
      operationNumber: 0,
      order: null,
      orderType: null,
      passportNumber: null,
      visaNumber: null,
      page: 1,
      rows: 20,
    }

    this.pendingSubscriptions = this.service
      .getPending(request)
      .subscribe((result: any) => {
        if (!result.error) {
          result.listOperationsDSO.items.forEach((item) => {
            item['statusExport'] = new LevelFormatPipe(this.injector).transform(
              item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(item.securityLevelsDTOList, 'nextStatus')
            item['opForPrint'] = this.modelPipe.transform(
              'hajjUmrahcardsOperations',
              item['operation'],
            )
          })
          this.pageResult = result.listOperationsDSO
        }
        this.pendingSubscriptions.unsubscribe()
      })

    this.pendingAllocSubscriptions = this.service
      .getPendingAllocations(request)
      .subscribe((result: any) => {
        if (!result.error) {
          result.listAllocationDTO.items.forEach((item) => {
            item['statusExport'] = new LevelFormatPipe(this.injector).transform(
              item.securityLevelsDTOList,
              'status',
            )
            item['nextStatusExport'] = new LevelFormatPipe(
              this.injector,
            ).transform(item.securityLevelsDTOList, 'nextStatus')
          })
          this.pageResultAllocation = result.listAllocationDTO
        }
        this.pendingAllocSubscriptions.unsubscribe()
      })
  }

  // search(){
  //     if(this.visaNumber==undefined)this.visaNumber=null;
  //     if(this.cardNumber==undefined)this.cardNumber=null;
  //     if(this.orderType==undefined)this.orderType=null;
  //     if(this.searchCategory == "passportNumber"){
  //        let request = {
  //                       "passportNumber": this.passportNumber,
  //                       "nationalId": null,
  //                       "page": 1,
  //                       "rows": 20,
  //                       "selectedIncentiveCards": this.searchCategory,
  //                       "status": null,
  //                       "order": null,
  //                       "orderType":null
  //                   }
  //               this.request.rows = 20;
  //               this.service.getPending(request).subscribe(data =>{
  //                 this.searchList = data;
  //               },err =>{
  //                 //console.log(err);
  //               });

  //     }else if(this.searchCategory == "nationalId"){
  //       let request = {
  //                       "cardnumber":null,
  //                       "nationalId": this.visa,
  //                       "page": 1,
  //                       "rows": 20,
  //                       "selectedIncentiveCards": this.searchCategory,
  //                       "status": null,
  //                       "order": null,
  //                       "orderType":null
  //                   }
  //               this.request.rows = 20;
  //               this.service.getPending(request).subscribe(data =>{
  //                 this.searchList = data;
  //               },err =>{
  //                 //console.log(err);
  //               });

  //     }else if(this.searchCategory == "status"){
  //       let request = {
  //                       "cardnumber":null,
  //                       "nationalId": null,
  //                       "page": 1,
  //                       "rows": 20,
  //                       "selectedIncentiveCards": this.searchCategory,
  //                       "status": this.status,
  //                       "order": null,
  //                       "orderType":null
  //                   }
  //               this.request.rows = 20;
  //               this.service.getPending(request).subscribe(data =>{
  //                 this.searchList = data;
  //               },err =>{
  //                 //console.log(err);
  //               });
  //     }

  //   }

  //   reset(){
  //     this.visa="";
  //     this.cardNumber="";
  //     this.status="";
  //   }
  onSelectAllocation({ selected }) {
    this.sharedData.selected.splice(0, this.sharedData.selected.length)

    this.sharedData.allocationsSelected.splice(
      0,
      this.sharedData.allocationsSelected.length,
    )
    this.sharedData.allocationsSelected.push(...selected)
  }

  onSelectOperation({ selected }) {
    this.sharedData.allocationsSelected.splice(
      0,
      this.sharedData.allocationsSelected.length,
    )

    this.sharedData.selected.splice(0, this.sharedData.selected.length)
    this.sharedData.selected.push(...selected)
  }

  changeDisplaySize(event) {
    this.tableDisplaySize = event
    this.setPage(null)
  }

  emit(changedTable) {
    const tableToEmpty =
      changedTable === 'tableAllocations'
        ? 'tableOperations'
        : 'tableAllocations'
    this.tableToEmpty.next(tableToEmpty)
  }
}
