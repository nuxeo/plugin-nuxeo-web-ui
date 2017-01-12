'use strict';

module.exports = function() {

  this.When(/^I have a document with content of mime-type ([-\w.]+\/[-\w.]+)$/, (mimeType) => {
    return fixtures.documents.import(this.doc, fixtures.blobs.mimeTypeBlobs[mimeType])
        .then((doc) => { this.doc = doc; });
  });

  this.Then(/^I can see a ([-\w]+) previewer$/, (viewerType) => {
    const page = this.ui.browser.documentPage(this.doc.type);
    page.view.waitForVisible();
    const preview = page.view.preview;
    preview.waitForVisible();
    preview.element('//div[@id="preview"]/' + viewerType).waitForVisible();
  });
};
