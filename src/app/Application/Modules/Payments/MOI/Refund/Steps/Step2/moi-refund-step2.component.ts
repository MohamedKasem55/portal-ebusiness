import {
  Component,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { LevelFormatPipe } from '../../../../../../Components/common/Pipes/getLevels-pipe'

@Component({
  selector: 'app-moi-refund-step2',
  templateUrl: './moi-refund-step2.component.html',
})
export class MoiRefundStep2Component implements OnInit, OnDestroy, OnChanges {
  @Input() formModel: any

  @Input() combosData: any

  @Input() fieldsConfigs: any[]

  subscriptions: Subscription[] = []

  @Input() preparedData: any[]

  @Input() batchList: any

  feesData: any[] = []

  constructor(public translate: TranslateService, private injector: Injector) {}

  ngOnInit() {
    this.formModel.disable()
    this.calculateFees()

    const batchList = []
    batchList.push(...this.batchList['notAllowed'])
    batchList.push(...this.batchList['toProcess'])
    batchList.push(...this.batchList['toAuthorize'])
    this.processItemsLevels(batchList)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateFees()
  }

  calculateFees() {
    const feesData = {}
    this.feesData = []
    /* const batchList = [];

        batchList.push(...this.batchList['notAllowed']);
        batchList.push(...this.batchList['toProcess']);
        batchList.push(...this.batchList['toAuthorize']);

        batchList.forEach((pd) => {
            const batch = pd;
            const serviceType = batch.serviceType;
            const applicationType = batch.applicationType;
            const amount = parseFloat(batch.amount);
            if (!feesData[serviceType + '-' + applicationType]) {
                feesData[serviceType + '-' + applicationType] = 0;
            }
            feesData[serviceType + '-' + applicationType] += amount;
        });
        const feesDataIds = Object.keys(feesData);
        this.feesData = [];
        feesDataIds.forEach((fdk) => {
            const s = fdk.split('-')[0];
            const a = fdk.split('-')[1];
            this.feesData.push({
                serviceType: s,
                applicationType: a,
                amount: feesData[fdk]
            });
        });
        //console.log("this.feesData", this.feesData);*/
  }

  getServiceTypeText(value) {
    let text = value
    this.combosData['eGovSadadRType']
      .filter((item) => item.key == value)
      .forEach((item) => {
        text = item.value
      })
    return text
  }

  getApplicationTypeText(st, value) {
    let text = value
    const transactionCombo =
      this.combosData['applicationsTypesAllCombosKey'][st]
    this.combosData[transactionCombo]
      .filter((item) => item.key == value)
      .forEach((item) => {
        text = item.value
      })
    return text
  }

  getAccountText(value) {
    let text = value
    this.combosData['accounts']
      .filter((item) => item.fullAccountNumber == value)
      .forEach((item) => {
        text = item.fullAccountNumber
        //+ (item.alias != '' ? ' - ' + item.alias : '')
        //+' '+(item.inquiry ? (' - ' + item.availableBalance +' '+ item.currency) : '')
      })
    return text
  }

  protected processItemsLevels(items) {
    if (Array.isArray(items) && items.length > 0) {
      items.forEach((item) => {
        if (item.futureSecurityLevelsDTOList) {
          item['statusExport'] = new LevelFormatPipe(this.injector).transform(
            item.futureSecurityLevelsDTOList,
            'status',
          )
          item['nextStatusExport'] = new LevelFormatPipe(
            this.injector,
          ).transform(item.futureSecurityLevelsDTOList, 'nextStatus')
        } else if (item.securityLevelsDTOList) {
          item['statusExport'] = new LevelFormatPipe(this.injector).transform(
            item.securityLevelsDTOList,
            'status',
          )
          item['nextStatusExport'] = new LevelFormatPipe(
            this.injector,
          ).transform(item.securityLevelsDTOList, 'nextStatus')
        }
        item['applicationTypeExport'] = this.getApplicationTypeText(
          item.serviceType,
          item.applicationType,
        )
        //console.log( item['applicationTypeExport']);
      })
    }
  }
}
