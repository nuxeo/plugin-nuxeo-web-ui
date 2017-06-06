Feature: Cloud Services

  Cloud providers can be added, edit and removed.

  Background:
    Given I login as "Administrator"

  Scenario: Cloud Services menu on drawer
    When I click the "administration" button
    Then I can see the administration menu
    When I click "Cloud services" in the administration menu
    Then I can see the cloud services page

  Scenario: Simple cloud providers view, create, edit, delete
    Given I am on cloud services page
    Then I can see the nuxeo-cloud-providers page
    And I can add the following provider:
      | name                    | value                 |
      | serviceName             | New Provider          |
      | description             | New Description       |
      | clientId                | New Client Id         |
      | clientSecret            | New Client Secret     |
      | authorizationServerURL  | http://newauthserver  |
      | scopes                  | One new scope, Other  |

    And I can see "New Provider" provider
    And I can edit "New Provider" provider to:
      | name                    |  value                   |
      | serviceName             | Super Provider           |
      | description             | Super Description        |
      | clientId                | Super Id                 |
      | clientSecret            | Super Secret             |
      | authorizationServerURL  | http://superauthserver   |
      | scopes                  | One super scope, super   |

    And I can see "Super Provider" provider
    And I cannot see "New Provider" provider
    And I can delete "Super Provider" provider
    And I cannot see "Super Provider" provider

  Scenario: View tokens list
    Given I am on cloud services page
    When I click the "tokens" pill
    Then I can see the nuxeo-cloud-tokens page
