Feature: Login / Logout

  As an user I can login and logout

  Scenario: Login
    When I login as "Administrator"
    Then I am logged in as "Administrator"

  Scenario: Logout
    When I logout
    Then I am logged out
