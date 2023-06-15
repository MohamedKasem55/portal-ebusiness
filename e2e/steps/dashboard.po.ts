import { browser, by, element, ExpectedConditions } from 'protractor';

export class DashboardPage {

	userName = element(by.css(".sme-header__user-name"));

	menu = element(by.css(".sme-header__menu-toggler"));
	menuOptions = element(by.css(".sme-navigation__menu-up"));
	menuAccounts = this.menuOptions.element(by.binding('accounts.currentAccounts.name')).parentElementArrayFinder;
	menuPayments = this.menuOptions.element(by.binding('dashboard.payments')).parentElementArrayFinder;
	menuTransfers = this.menuOptions.element(by.binding('dashboard.transfers')).parentElementArrayFinder;
	menuPayrolls = this.menuOptions.element(by.binding('dashboard.payrolls')).parentElementArrayFinder
	menuCompanyAdmin = this.menuOptions.element(by.binding('dashboard.company-admin')).parentElementArrayFinder;
	
	getUserName(){
		return this.userName.getText();
	}
	toggleMenu(){
		const EC=ExpectedConditions;
		browser.wait(EC.visibilityOf(this.menu),10000,"No encontrado el boton de menu");
		return this.menu.click();
	}

	toggleAccountOptions(){
		return this.menuAccounts.click();
	}

	togglePaymentOptions(){
		return this.menuPayments.click();	
	}

	toggleTransferOptions(){
		return this.menuTransfers.click();
	}

	togglePayrollsOptions(){
		return this.menuPayrolls.click();
	}

	toggleCompanyMyAdminOptions(){
		return this.menuCompanyAdmin.click();
	}

	goTransferOptions(){
		this.toggleMenu();
		return this.toggleTransferOptions();
	}
}