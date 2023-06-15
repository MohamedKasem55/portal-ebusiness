import {NgModule} from '@angular/core'
import {AppSharedModule} from '../../../core/shared/shared.module'
import {AccountListComponent} from './account-list/account-list.component'
import {FeeVatCalculator} from './fee-vat-calculator/fee-vat-calculator.component'
import {StaticService} from '../Common/Services/static.service';

@NgModule({
    declarations: [AccountListComponent, FeeVatCalculator],
    exports: [AccountListComponent, FeeVatCalculator],
    providers: [StaticService],
    imports: [AppSharedModule],
})
export class SharedModule {
}
