import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: 'zid',
    loadChildren: () =>
        import('./zid/zid.module').then((m) => m.ZidModule),
  },
  {
    path: 'qoyod',
    loadChildren: () =>
        import('./qoyod/qoyod.module').then((m) => m.QoyodModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessHubRoutingModule {}