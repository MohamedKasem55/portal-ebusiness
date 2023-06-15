Feature: Login

Scenario: A first scenario

Given I am in the page
Then I see the title "Log in Al Mubasher eSME"
And I see an input field "profileField"
And I see an input field "userField"
When I type "3045369" in field "profileField"
And I type "3045369ad-38" in field "userField"
And I click in button Proceed
Then I see an input field "passwordField"