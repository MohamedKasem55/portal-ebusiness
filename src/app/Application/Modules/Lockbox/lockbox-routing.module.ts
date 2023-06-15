import { LockboxstatementGuard } from './lockboxstatement/lockboxstatement.guard'
import { Routes } from '@angular/router'
import { CdmReportsGuard } from './cdmreports/cdm-reports.guard'

export const routes: Routes = [
  {
    path: 'cdm-accounts',
    canLoad: [LockboxstatementGuard],
    loadChildren: () =>
      import('./cdmaccounts/cdm-accounts.module').then(
        (m) => m.CdmAccountsModule,
      ),
  },
  {
    path: 'cdm-users',
    canLoad: [LockboxstatementGuard],
    loadChildren: () =>
      import('./cdmusers/cdm-users.module').then((m) => m.CdmUsersModule),
  },
  {
    path: 'cdm-statements',
    canLoad: [LockboxstatementGuard],
    loadChildren: () =>
      import('./lockboxstatement/lockboxstatement.module').then(
        (m) => m.LockboxstatementModule,
      ),
  },
  {
    path: 'cdm-terminals',
    canLoad: [],
    loadChildren: () =>
      import('./cdmterminal/cdm-terminal.module').then(
        (m) => m.CdmTerminalModule,
      ),
  },
  {
    path: 'ca-cdm-terminals',
    canLoad: [],
    loadChildren: () =>
      import('./cdmterminals/cdm-terminals.module').then(
        (m) => m.CdmTerminalsModule,
      ),
  },
  {
    path: 'cdm-reports',
    canLoad: [CdmReportsGuard],
    loadChildren: () =>
      import('./cdmreports/cdm-reports.module').then((m) => m.CdmReportsModule),
  },
]
