import { Routes } from '@angular/router'
import { LocalTransferReactivationComponent } from './components/local/local-transfer-reactivation.component'
import { WithinTransferReactivationComponent } from './components/within-alrajhi/within-transfer-reactivation.component'
import { InternationalTransferReactivationComponent } from './components/international/international-transfer-reactivation.component'

export const routes: Routes = [
  {
    path: 'local',
    component: LocalTransferReactivationComponent,
  },
  {
    path: 'within',
    component: WithinTransferReactivationComponent,
  },
  {
    path: 'international',
    component: InternationalTransferReactivationComponent,
  },
]
