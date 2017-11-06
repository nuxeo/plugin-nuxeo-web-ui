'use strict';

import BasePage from '../../base';
import DocumentLayout from './document_layout';

export default class DocumentCreate extends BasePage {
  getDoctypeButton(docType) {
    const typeSelection = this.el.element(`div[name="typeSelection`);
    return this.el.element(`div[name="typeSelection"] paper-button[name="${docType}"]`);
  }

  layout(docType) {
    return new DocumentLayout(`nuxeo-${docType.toLowerCase()}-create-layout`);
  }
}
