'use strict';

module.exports = function () {
  this.Given(/^I have a clean recently viewed documents list/, () => {
    fixtures.documents.clearLocalStorage(this.username, 'nuxeo-recent-documents');
    fixtures.documents.reloadLocalStorage('* >>> nuxeo-recent-documents >>> #storage');
  });

  this.Given(/^I have document with path "(.+)" on the recently viewed documents list/, (path) => {
    fixtures.documents.addToLocalStorage(path, this.username, 'nuxeo-recent-documents');
  });

  this.Then('I can see the list of recently viewed documents', () => {
    this.ui.drawer.recents.waitForVisible().should.be.true;
  });

  this.Then('I can see the list of recently viewed documents has "$nb" items', (nb) => {
    fixtures.documents.reloadLocalStorage('* >>> nuxeo-recent-documents >>> #storage');
    this.ui.drawer.recents.waitForVisible();
    this.ui.drawer.recents.nbItems.should.be.equals(parseInt(nb));
  });

  this.Then('I can see the list of recently viewed documents has "$title" document', (title) => {
    fixtures.documents.reloadLocalStorage('* >>> nuxeo-recent-documents >>> #storage');
    this.ui.drawer.recents.waitForVisible();
    this.ui.drawer.recents.el.hasElementByTextContent('#recentDocumentsList .list-item-title', title).should.be.true;
  });
};
