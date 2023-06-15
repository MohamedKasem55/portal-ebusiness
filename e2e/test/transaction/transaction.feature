Feature: transaction
    There is 4 type of transaction own,rajhi,local and international, there is a simple test to check all of them. 
    

    Background: Always I have to logged in, and in dashboard page
        Given I am in the page
        When I logged in company "3045369" with user "3045369adm-38"
         And password "test1234"
        Then I can see user "luismi38" is login

    Scenario: <enter scenario title>
        Given I was in transfer option  