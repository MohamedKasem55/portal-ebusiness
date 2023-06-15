import { expect } from 'chai';
import { Before, Given, setDefaultTimeout, Then, When } from 'cucumber';
import { DashboardPage } from './dashboard.po';
import { LoginPage } from './login.po';

setDefaultTimeout(60 * 1000);

let login: LoginPage;
let dashboard: DashboardPage;
Before(() => {
	login=new LoginPage();
	dashboard=new DashboardPage();
});
When(/^I logged in company "(.*?)" with user "(.*?)"$/,async (company, user) => {
	return login.completeProfile(company,user);
});

When(/^password "(.*)"$/,async(pass)=>{
	return login.sendPassword(pass);
})

Then(/^I can see user "(.*)" is login$/,(string: String) => dashboard.getUserName().then(h1title => expect(h1title).to.equal(string)));

Given(/^I was in transfer option$/,() => {
	return true;
});