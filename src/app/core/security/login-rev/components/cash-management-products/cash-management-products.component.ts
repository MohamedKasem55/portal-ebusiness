import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CashManagementProductsService} from "./cash-management-products.service";
import {StaticService} from "../../../../../Application/Modules/Common/Services/static.service";
import {AbstractWizardComponent} from "../../../../../Application/Modules/Common/Components/Abstract/abstract-wizard.component";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {RegisterProductInterest} from "../../models/http-requests.model";
import {StorageService} from "../../../../storage/storage.service";
import {CommonValidators} from "../../../../../Application/Modules/Common/constants/common-validators.service";


@Component({
  selector: 'arb-cash-management-products',
  templateUrl: './cash-management-products.component.html',
  styleUrls: ['./cash-management-products.component.scss']
})
export class CashManagementProductsComponent extends AbstractWizardComponent implements OnInit {

  showForm = false
  form: FormGroup
  statics = {}
  currentUser: any

  constructor(
      public service: CashManagementProductsService,
      public staticService: StaticService,
      public fb: FormBuilder,
      public translate: TranslateService,
      public router: Router,
      private storageService: StorageService,
      public commonValidators: CommonValidators,
  ) {
    super(fb, translate, router);
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    this.getStatics()
  }

  applyForProduct(product){
    this.form = this.service.buildForm(product, this.currentUser)
    this.showForm = true
  }

  back() {
    switch (this.wizardStep) {
      case 1:
        this.showForm = false
        break
      default:
        this.wizardStep--
        if(this.form.disabled){
          this.form.enable()
        }
    }
  }

  getWizardStepsCount() {
    return 3
  }

  isDisabled() {
  }

  next() {
    switch (this.wizardStep){
      case 1:
        this.form.disable()
        this.wizardStep++
        break;
      case 2:
        const requestBody: RegisterProductInterest = {
          product: this.form.get("product").value,
          orgName: this.form.get("orgName").value,
          orgId: this.form.get("orgId").value,
          region: this.form.get("region").value,
          city: this.form.get("city").value,
          yearlyIncome: this.form.get("yearlyIncome").value,
          contactName: this.form.get("contactName").value,
          contactMobile: this.form.get("contactMobile").value,
          contactEmail: this.form.get("contactEmail").value,
          bestTimeToCall: this.form.get("bestTimeToCall").value,
        }
        this.service.submitProductInterest(requestBody).subscribe(res => {
          if (res && res.errorCode == '0'){
            this.wizardStep++
          }
        })
        break;
      default:
        this.wizardStep++
    }
  }

  onInitStep(step, events) {
  }

  valid() {
  }

  getStatics(){
    const staticNames = ["CashManagementProducts", "cashManagementRegions", "yearlyIncome", "bestTimeToCall", "cityType"]
    this.service.getStatics(staticNames).subscribe(res => {
      if (res){
        res.forEach(model => {
          this.statics[Object.keys(model)[0]] = model[Object.keys(model)[0]]
        })
      }
    })
  }

  routeToRoot(){
    this.router.navigateByUrl("/")
  }

  getValueFromKey(arr, key){
    return arr.find(obj => obj.key === key).value
  }

  changeLang(lang) {
    this.translate.use(lang).subscribe((result) => {
      this.storageService.store('currentLanguage', lang)
      this.getStatics()
      this.router.navigateByUrl(this.router.url)
    })
  }

}
