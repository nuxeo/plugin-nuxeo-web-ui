'use strict';

module.exports = function() {

  this.Given(/^I have a (.*) document$/, (docType) => {
    docType = docType || 'File';
    let doc = fixtures.documents.init(docType);
    // create the document
    return fixtures.documents.create(this.doc.path, doc).then((doc) => {
      this.doc = doc;
    });
  });

  this.Given(/^I have a document imported from file "(.+)"$/, (mimeType) => {
    return fixtures.documents.import(this.doc, fixtures.blobs.mimeTypeBlobs[mimeType])
        .then((doc) => { this.doc = doc; });
  });

  this.Given(/^I have permission (\w+) for this document$/, (permission) => {
    return fixtures.documents.setPermissions(this.doc, permission, this.username).then((doc) => {
      this.doc = doc;
    })
  });

  this.Given(/^I have a document added to "([^"]*)" collection$/, (colName) => {
    let doc = fixtures.documents.init('File');
    // create the document
    return fixtures.documents.create(this.doc.path, doc)
        .then((doc) => fixtures.collections.addToNewCollection(doc, colName)).then((doc) => {
          this.doc = doc;
        });
  });

  this.Given(/^this document has file "(.+)" for content$/, (file) => {
    return fixtures.documents.attach(this.doc, fixtures.blobs.get(file));
  });

  this.Given(/^this document has file "(.+)" for attachment/, (file) => {
    return fixtures.documents.attach(this.doc, fixtures.blobs.get(file), true);
  });

  this.When('I browse to the document', () => {
    driver.url('/#!/browse' + this.doc.path);
    this.ui.browser.breadcrumb.waitForVisible();
  });

  this.Then('I can see the document\'s title', () => {
    this.ui.browser.title.waitForVisible();
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
    page.view.waitForVisible();

    let newContent = 'NEW ' + format + ' CONTENT';
    switch (format) {

      case 'HTML':
      case 'XML':
        let editor = page.view.el.element('#editor');
        editor.waitForVisible();
        editor.setValue(newContent);
        let save = page.view.el.element('paper-button[name="editorSave"]');
        save.waitForVisible();
        save.click();
        driver.waitForExist('#editor');
        editor = page.view.el.element('#editor');
        editor.waitForVisible();
        (editor.getAttribute('innerHTML') === ('<p>' + newContent + '</p>')).should.be.true;
        break;

      case 'Markdown':
      case 'Text':
        let edit = page.view.el.element('#editNote');
        edit.waitForVisible();
        edit.click();
        let textarea = page.view.el.element('nuxeo-note-editor #textarea');
        textarea.waitForVisible();
        textarea.setValue(newContent);
        let saveNote = page.view.el.element('paper-button[name="editorSave"]');
        saveNote.waitForVisible();
        saveNote.click();
        const preview = page.view.preview;
        preview.waitForVisible();
        if (format == 'Markdown') {
          let markedElement = preview.element('marked-element');
          markedElement.waitForVisible();
          let markedContent = markedElement.element('div.markdown-html');
          markedContent.waitForVisible();
          (markedContent.getText() === newContent).should.be.true;
        } else if (format == 'Text') {
          let iframe = preview.element('iframe');
          iframe.waitForVisible();
          // TODO: ELEMENTS-213: add preview in nuxeo-document-preview
          // check new Text previewer content here
          // for now just checking that the default iframe previewer exists
        }
        break;
    }
  });

  this.Then('I add the document to the "$name" collection', (name) => {
    this.ui.browser.addToCollection(name);
    liveCollections.push(name);
  });

  this.Then('I can see the document belongs to the "$name" collection', (name) => {
    this.ui.browser.hasCollection(name).should.be.true;
  });

  this.Then('I can delete the document from the "$name" collection', (name) => {
    this.ui.browser.removeFromCollection(name).should.be.true;
  });

  this.Then('I can see the document does not belong to the "$name" collection', (name) => {
    this.ui.browser.doNotHaveCollection(name).should.be.true;
  });

  this.Then('I add the document to the favorites', () => {
    this.ui.browser.addToFavorites();
  });
};
