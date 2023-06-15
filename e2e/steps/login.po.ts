import { browser, by, element, ExpectedConditions } from 'protractor';

export class LoginPage {

	profileField = element(by.css("#sme-login-form-input-organization-profile"));
  userField  = element(by.css("#sme-login-form-input-user-id"));
  passwordField =element(by.css("#sme-login-form-input-password"));
  title=element(by.css(".sme-login-form__title"));
  

  userButton = element(by.css("#button-submit-user"));
  loginPasswordButton = element(by.css("#button-submit-login-password"));
  loginOtpButton = element(by.css("#button-submit-login-otp"));

  navigateTo() {
    return browser.get('/');
  }

  loginFormTitle() {
    return this.title.getText();
  }

  getInput(string){
  	if(this[string])
  		return this[string].isDisplayed();
  	return null;
  }

  inputText(input, text){
   return this[input].sendKeys(text);
  
  }

  clickUserButton(){
  	return this.userButton.click();
  }

  clickLoginPasswordButton(){
    return this.loginPasswordButton.click();

  }

  completeProfile(company,user){
    this.profileField.sendKeys(company);
    this.userField.sendKeys(user);
    return this.clickUserButton();
  }

  sendPassword(pass){
    var EC=ExpectedConditions;
    browser.wait(EC.visibilityOf(this.passwordField),10000,"No encontrado el campo de password");
    this.passwordField.sendKeys(pass);
    return this.clickLoginPasswordButton();  
  }
}