Feature: Browser

  I can browse the repository

  Background:
    Given I login as "Administrator"

  Scenario: Browse
    When I click the "browser" button
    Then I can see the browser tree
    And I can see the "Domain" browser tree node
    When I click "Domain" in the browser tree
    Then I can see that "Templates" is content of the document
    Then I can see that "Sections" is content of the document
    Then I can see that "Workspaces" is content of the document
    Then I can see the "Workspaces" browser tree node
    When I click "Workspaces" in the browser tree
    Then I can see the "Workspaces" document
