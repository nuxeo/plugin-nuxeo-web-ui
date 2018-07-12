const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');

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
    const page = this.ui.browser.documentPage(this.doc.type);
    page.view.waitForVisible(`#dialog ${viewerType}`);

    //  For investigation purposes
    driver.pause(3000);
    mkdirp.sync(process.env.SCREENSHOTS_PATH);
    const fileName = path.join(process.env.SCREENSHOTS_PATH,
        `${viewerType}(INVESTIGATION).png`);
    const screenshot = driver.saveScreenshot();
    fs.writeFileSync(fileName, screenshot);
    //  End
  });

  this.Then(/^I can see an attachment ([-\w]+) previewer$/, (viewerType) => {
    const page = this.ui.browser.documentPage(this.doc.type);
    page.metadata.attachments.waitForVisible(`#dialog ${viewerType}`);

    //  For investigation purposes
    driver.pause(3000);
    mkdirp.sync(process.env.SCREENSHOTS_PATH);
    const fileName = path.join(process.env.SCREENSHOTS_PATH,
        `${viewerType}(INVESTIGATION).png`);
    const screenshot = driver.saveScreenshot();
    fs.writeFileSync(fileName, screenshot);
    //  End
  });
};
