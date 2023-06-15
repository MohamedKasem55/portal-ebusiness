import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {FormGroup} from "@angular/forms";
import {PagedData} from "../../../../Model/paged-data";
import {DatatableMobileComponent} from "../../../../../core/responsive/datatable-mobile.component";
import {ModelService} from "../../../../Components/common/model.service";
import {CommunityServicesService} from "./community-services.service";
import {Observable} from "rxjs";

@Component({
  selector: 'arb-community-services',
  templateUrl: './community-services.component.html',
  styleUrls: ['./community-services.component.scss']
})
export class CommunityServicesComponent extends DatatableMobileComponent implements OnInit {

  charityBaseModels: any;
  pageSize: number = 20
  transactionsList: PagedData<any> = new PagedData<any>()
  formModel: FormGroup
  charityCategory:any;
  charityCategoryGroups: any[]= [];
  charityGroup: any;

  initData = {
    pageSize: this.pageSize,
    offset: 0
  }
  language: any;

  constructor(
      public router: Router,
      public translate: TranslateService,
      public modelService: ModelService,
      public service: CommunityServicesService

  ) {
    super()
    this.getModelData()

  }

  ngOnInit(): void {
    this.formModel = this.service.getFormModel();
    this.setPage(this.initData);
  }

  navigateToSingleCharityTransfer(){
    this.router.navigateByUrl('/transfers/charity/single-charity-transfer')
  }

  setPage(page) {
    this.transactionsList.page.pageNumber = page.offset
    this.transactionsList.page.pageSize = page.pageSize

    let baseParams = {
      maxRecs: page.pageSize,
      offset: ++page.offset,
    }
    let params = {
      ...baseParams,
      ...(this.formModel.controls['charityCategoryPk'].value) && {charityCategoryPk: this.formModel.controls['charityCategoryPk'].value},
      ...(this.formModel.controls['charityGroupId'].value) && {charityGroupId: this.formModel.controls['charityGroupId'].value},
    }
    this.service.getSingleCharityList(params).subscribe(result => {
      if(result.errorCode == '0'){

        this.transactionsList.data = result.charityTransferBatchList;
        this.transactionsList.page.totalElements = result.total;
        this.transactionsList.page.size = result.size;
        }


      }
    );
  }

  setPageSize(size){
    this.pageSize = size
    const page = {
      pageSize: size,
      offset: 0
    }

    this.setPage(page)
  }

  setPageOffset(offset){
    const page = {
      pageSize: this.pageSize,
      offset: offset
    }

    this.setPage(page)
  }

  selectCategory(charityCategory: any){
    this.charityCategory=charityCategory;
    this.charityGroup = null;
    this.charityCategoryGroups = charityCategory?.value?.charityGroups;
    this.formModel.get("charityCategoryPk").setValue(charityCategory?.key)
  }

  selectGroup(charityGroup: any){
    this.charityGroup = charityGroup;
    this.formModel.get("charityGroupId").setValue(charityGroup.groupId)

  }

  reset(){
    this.formModel.reset();
    this.selectCategory(null);
  }

  getModel() {
    const modelData = this.modelService.getModel(this.language, 'charityCategories');
    if (modelData instanceof Observable) {
      modelData.subscribe(result => {
        this.charityBaseModels = result;
      })
    } else {
      this.charityBaseModels = modelData;
    }
  }

  private getModelData() {
    this.language = this.translate.currentLang;
    this.getModel();
    this.translate.onLangChange.subscribe(result => {
      this.language = result.lang;
      this.getModel()
    })
  }
}
