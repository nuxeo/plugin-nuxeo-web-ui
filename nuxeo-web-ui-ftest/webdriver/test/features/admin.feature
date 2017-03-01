Feature: Admin center

  As an Administrator I have an Admin center
  As a member user I have no Admin center

  Scenario: Admin center as Admin
    Given I login as "Administrator"
    When I click the "administration" button
    Then I can see the administration menu

    # Analytics
    When I click "Analytics" in the administration menu
    Then I can see the analytics page

    # Users & Groups
    When I click "Users & Groups" in the administration menu
    Then I can see the users and groups page

  Scenario: Admin center as member user
    Given user "John" exists in group "members"
    And I login as "John"
    Then I cannot see the administration button
    And I cannot see the administration menu