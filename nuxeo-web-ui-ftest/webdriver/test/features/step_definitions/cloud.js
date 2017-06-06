'use strict';

module.exports = function () {
  this.Then('I can see the nuxeo-cloud-providers page', () =>
    this.ui.administration.cloudServices.nuxeoCloudProviders.waitForVisible().should.be.true);

  this.Then('I can see the nuxeo-cloud-tokens page', () =>
    this.ui.administration.cloudServices.nuxeoCloudTokens.waitForVisible().should.be.true);

  this.Then('I can add the following provider:', (table) => {
    this.ui.administration.cloudServices.addProvider(table);
  });

  this.Then('I can see "$name" provider', (name) => {
    this.ui.administration.cloudServices.waitForHasProvider(name).should.be.true;
  });

  this.Then('I cannot see "$name" provider', (name) => {
    this.ui.administration.cloudServices.waitForHasProvider(name, true).should.be.true;
  });

  this.Then('I can edit "$currentName" provider to:', (currentName, newDetails) => {
    this.ui.administration.cloudServices.editProvider(currentName, newDetails);
  });

  this.Then('I can delete "$name" provider', (name) => {
    this.ui.administration.cloudServices.deleteProvider(name);
  });

  this.When('I click the "$name" pill', (name) => {
    this.ui.administration.cloudServices.clickElementName(name);
  });
};
