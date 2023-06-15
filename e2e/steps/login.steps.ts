import { expect } from 'chai';
import { Given, When, Then, Before, setDefaultTimeout } from 'cucumber';
import { LoginPage } from './login.po';
import { browser } from 'protractor';

	setDefaultTimeout(60 * 1000);

	let login: LoginPage;
	
	Before(() => {
		login=new LoginPage();
	});
	
	Given(/^I am in the page$/,async () => {
		await browser.get('/');
	});
	
	When(/^I type "(.*?)" in field "(.*?)"$/,
		(string: String, input: String) => login.inputText(input,string));

	Then(/^I see the title "(.*?)"$/,
		(string: String) => login.loginFormTitle().then(h1title => expect(h1title).to.equal(string)));
  
	Then(/^I see an input field "(.*?)"$/,async (string) => {
		(string: String) => login.getInput(string).then(h1title => expect(h1title).to.be.ok)});
	
	Then(/^I click in button Proceed$/,()=> login.clickUserButton());