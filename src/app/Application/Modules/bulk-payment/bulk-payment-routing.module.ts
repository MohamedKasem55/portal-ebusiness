import { Routes } from '@angular/router'
import { DownloadTempGuard } from './download-temp/download-temp.guard'
import { ProcessedfileGuard } from './processed-file/processedfile.guard'
import { ReqStatusGuard } from './req-status/req-status.guard'
import { BulkPaymentComponent } from './bulk-payment.component'
import { UploadfileGuard } from './uploadfile/uploadfile.guard'
import {BulkPaymentSelfOnboardComponent} from "./self-onboard/bulk-payment-self-onboard.component";

export const routes: Routes = [
  {
    path: 'bulkPaymentOption',
    component: BulkPaymentComponent,
  },
  {
    path: 'selfOnboard',
    component: BulkPaymentSelfOnboardComponent,
  },
  {
    path: 'uploadFile',
    canLoad: [UploadfileGuard],
    loadChildren: () =>
      import('./uploadfile/uploadfile.module').then((m) => m.UploadfileModule),
  },
  {
    path: 'processedFile',
    canLoad: [ProcessedfileGuard],
    loadChildren: () =>
      import('./processed-file/processed-file.module').then(
        (m) => m.ProcessedFileModule,
      ),
  },
  {
    path: 'reqStatus',
    canLoad: [ReqStatusGuard],
    loadChildren: () =>
      import('./req-status/req-status.module').then((m) => m.ReqStatusModule),
  },
  {
    path: 'downloadTemp',
    canLoad: [DownloadTempGuard],
    loadChildren: () =>
      import('./download-temp/download-temp.module').then(
        (m) => m.DownloadTempModule,
      ),
  },
]
