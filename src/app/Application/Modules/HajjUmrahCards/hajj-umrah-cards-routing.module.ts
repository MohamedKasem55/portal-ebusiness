import { Routes } from '@angular/router'
import { CardalloctionGuard } from './CardAllocationRequest/cardalloction.guard'
import { HajjUmrahOptionsComponent } from './hajj-umrah-options.component'

export const routes: Routes = [
  {
    path: 'cardinquires',
    //canLoad: [UploadfileGuard],
    loadChildren: () =>
      import('./CardInquires/cardinquires.module').then(
        (m) => m.CardinquiresModule,
      ),
  },
  {
    path: 'cardallocationrequest',
    canLoad: [CardalloctionGuard],
    loadChildren: () =>
      import('./CardAllocationRequest/allocationreq.module').then(
        (m) => m.AllocationreqModule,
      ),
  },
  {
    path: 'cardoperation',
    //canLoad: [ProcessedfileGuard],
    loadChildren: () =>
      import('./CardOperations/cardoperations.module').then(
        (m) => m.CardoperationsModule,
      ),
  },
  {
    path: 'reqStatus',
    //canLoad: [BillPaymentGuard],
    loadChildren: () =>
      import('./RequestStatus/requeststatus.module').then(
        (m) => m.RequeststatusModule,
      ),
  },
  {
    path: 'reports',
    //canLoad: [DownloadTempGuard],
    loadChildren: () =>
      import('./Reports/card.reports.module').then((m) => m.CardReportsModule),
  },
  {
    path: 'options',
    component: HajjUmrahOptionsComponent,
  },
]
