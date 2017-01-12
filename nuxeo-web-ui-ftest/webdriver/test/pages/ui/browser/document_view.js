'use strict';


export default class DocumentView {
  constructor(el, docType) {
    this.el = el;
    this.docType = docType;
  }

  isVisible() {
    return this.el.isVisible();
  }

  waitForVisible() {
    return this.el.isVisible();
  }

  get preview() {
    return this.el.element('nuxeo-document-preview');
  }

  get layout() {
    return this.el.element(`nuxeo-${this.docType.toLowerCase()}-view-layout`);
  }
}