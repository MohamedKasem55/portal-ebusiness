import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestNewDocumentComponent } from './request-new-document/request-new-document.component';
import { DocumentStatusComponent } from './document-status/document-status.component';
import {routes} from './customer-documents-routes.module'
import {AppSharedModule} from "../../../../core/shared/shared.module";
import {RouterModule} from "@angular/router";
import {ModalModule} from "ngx-bootstrap/modal";
import {BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {DocumentStatusDetailsComponent} from "./document-status-details/document-status-details.component";
import {TooltipModule} from "ngx-bootstrap/tooltip";


@NgModule({
  declarations: [
    RequestNewDocumentComponent,
    DocumentStatusComponent,
    DocumentStatusDetailsComponent
  ],
    imports: [
        CommonModule,
        AppSharedModule,
        RouterModule.forChild(routes),
        ModalModule.forRoot(),
        BsDatepickerModule,
        TooltipModule,
    ],
  providers: [

  ],
  exports: [

  ]
})
export class CustomerDocumentsModule {
  public static routes: any = routes
}
