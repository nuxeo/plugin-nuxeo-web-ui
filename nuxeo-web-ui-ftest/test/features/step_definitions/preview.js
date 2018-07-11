const path = require('path');

'use strict';

module.exports = function () {
  this.When('I click the preview button', () => {
    const page = this.ui.browser.documentPage(this.doc.type);
    page.waitForVisible();
    page.previewButton.waitForVisible();
    page.previewButton.click();
  });

  this.When('I click the preview button for the attachment', () => {
    const page = this.ui.browser.documentPage(this.doc.type);
    page.waitForVisible();
    page.metadata.attachments.waitForVisible();
    page.metadata.attachments.previewButton.click();
  });

  this.Then(/^I can see the inline ([-\w]+) previewer$/, (viewerType) => {
    const page = this.ui.browser.documentPage(this.doc.type);
    page.view.waitForVisible();
    const preview = page.view.preview;
    preview.waitForVisible();
    preview.element(viewerType).waitForVisible();
  });

  this.Then(/^I can see a ([-\w]+) previewer$/, (viewerType) => {
    // For investigation purposes

    const fileName = path.join(process.env.SCREENSHOTS_PATH,
        `${viewerType}(INVESTIGATION).png`);

    console.log('Path', fileName);

    driver.saveScreenshot(fileName);
    // End

    driver.waitForVisible(`#dialog ${viewerType}`);
  });
};
