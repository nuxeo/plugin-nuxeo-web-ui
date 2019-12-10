import BasePage from '../../base';
import DocumentVersions from './document_versions';

export default class PublicationDialog extends BasePage {
  publish(target, rendition, version, override) {
    // set target
    const targetSelect = this.el.element('#target');
    fixtures.layouts.setValue(targetSelect, target);
    // set rendition
    if (rendition) {
      const renditionSelect = this.el.element('#rendition');
      fixtures.layouts.setValue(renditionSelect, rendition);
    }
    // set version
    if (version) {
      const versionsList = new DocumentVersions(`${this._selector} #version`);
      versionsList.toggle.waitForVisible();
      versionsList.toggle.click();
      versionsList.listItems.waitForVisible();
      versionsList.selectVersion(version);
    }
    if (override) {
      const overrideCheckbox = this.el.element('#override');
      fixtures.layouts.setValue(overrideCheckbox, true);
    }
    this.el.waitForVisible('#publish');
    this.el.waitForEnabled('#publish');
    this.el.click('#publish');
    // wait for iron-overlay-backdrop to not be visible
    driver.waitForVisible('iron-overlay-backdrop', driver.options.waitForTimeout, true);
  }

  waitForVisible() {
    return this.el.waitForVisible();
  }
}
