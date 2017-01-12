'use strict';

module.exports = function() {

  this.Given(/^I have a(.*)document$/, (docType) => {
    docType = docType || 'File';
    let doc = fixtures.documents.init(docType);
    // create the document
    return fixtures.documents.create(this.doc.path, doc).then((doc) => {
      this.doc = doc;
    });
  });

  this.Given(/^I have a(.*)document with permission (\w+)$/, (docType, permission) => {
    docType = docType || 'File';

    let doc = fixtures.documents.init(docType);
    // create the document
    return fixtures.documents.create(this.doc.path, doc)
        .then((doc) => fixtures.documents.setPermissions(doc, permission, this.username))
        .then((doc) => {
          this.doc = doc;
        });
  });

  this.When('I browse to the document', () => {
    driver.url('/#!/browse' + this.doc.path);
    driver.waitForExist('.breadcrumb-item-current', 5000);
  });

  this.Then('I can see the document\'s title', () => {
    const breadcrumb = this.ui.browser.breadcrumb();
  });

  this.Then(/^I can edit the (.*) metadata$/, (docType) => {
    const page = this.ui.browser.documentPage(docType);
    page.metadata.waitForVisible();
    page.edit.isVisible().should.be.false;
    page.editButton.waitForVisible();
    page.editButton.click();
    page.edit.waitForVisible();
    page.metadata.isVisible().should.be.false;
    page.edit.title = docType;
    page.saveButton.isVisible().should.be.true;
    page.saveButton.click();
    page.metadata.waitForVisible();
  });

  this.Given(/^I have a (.+) Note$/, (format) => {
    let doc = fixtures.documents.init('Note');
    doc.properties['note:mime_type'] = fixtures.notes.formats[format].mimetype;
    doc.properties['note:note'] = fixtures.notes.formats[format].content;
    return fixtures.documents.create(this.doc.path, doc).then((result) => {
      this.doc = result;
    });
  });

  this.Then(/^I can edit the (.*) Note$/, (format) => {
    let page = this.ui.browser.documentPage(this.doc.type);
    page.view.isVisible().should.be.true;
    switch (format) {
      case 'HTML':
      case 'XML':
        let newContent = '<h2>NEW HTML CONTENT</h2>';
        let editor = page.view.el.element('#editor');
        editor.isVisible().should.be.true;
        editor.setValue(newContent);
        let save = page.view.el.element('paper-button[name="editorSave"]');
        save.isVisible().should.be.true;
        save.click();
        driver.waitForExist('#editor');
        editor = page.view.el.element('#editor');
        editor.isVisible().should.be.true;
        (editor.getText() === newContent).should.be.true;
        break;
    }
  });
};
