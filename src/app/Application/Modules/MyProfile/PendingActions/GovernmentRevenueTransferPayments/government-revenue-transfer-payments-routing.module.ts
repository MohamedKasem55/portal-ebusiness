import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'
import {Step1Component} from './components/Step1/step1.component'
import {DetailComponent} from './components/detail/detail.component'
import {Step2Component} from './components/Step2/step2.component'
import {Step3Component} from './components/Step3/step3.component'
import {GovernmentRevenueTransferPaymentsComponent} from './government-revenue-transfer-payments.component'
import {FileDetailComponent} from "./components/detail/file-detail.component";

const routes: Routes = [
    {
        path: '',
        component: GovernmentRevenueTransferPaymentsComponent,
        children: [
            {
                path: '',
                redirectTo: 'step1',
                pathMatch: 'full',
            },
            {
                path: 'step1',
                component: Step1Component,
            },
            {
                path: 'detail',
                component: DetailComponent,
            },
            {
                path: 'file-detail',
                component: FileDetailComponent,
            },
            {
                path: 'step2',
                component: Step2Component,
            },
            {
                path: 'step3',
                component: Step3Component,
            },
        ],
    },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GovernmentRevenueTransferPaymentsRoutingModule {
}
