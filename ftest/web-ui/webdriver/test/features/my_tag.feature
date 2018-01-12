@watch
Feature: My Tag Action

  I can use the new my tag document action

  Background:
    Given I login as "Administrator"


  Scenario: Tag document
    Given I have a HTML Note
    When I browse to the document
    Then I myTag the document
    And I can see the document is tagged with "foo"
    And I can see the document is tagged with "bar"
