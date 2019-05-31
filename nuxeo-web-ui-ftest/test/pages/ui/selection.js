'use strict';

import BasePage from '../base';
import AddToCollectionDialog from './browser/add_to_collection_dialog';

export default class Selection extends BasePage {

  addToClipboard() {
    this.el.element('nuxeo-clipboard-documents-button').click();
    this.waitForNotVisible();
  }

  get addDocumentsToCollectionButton() {
    return this.el.element('nuxeo-add-to-collection-documents-button');
  }

  get addToCollectionDialog() {
    const button = this.addDocumentsToCollectionButton;
    button.waitForVisible();
    if (!button.isExisting('#dialog') || !button.isVisible('#dialog')) {
      button.click();
    }
    const dialog = new AddToCollectionDialog('nuxeo-add-to-collection-documents-button #dialog');
    dialog.waitForVisible();
    return dialog;
  }

  moveDown() {
    this.el.waitForVisible('nuxeo-move-documents-down-button');
    this.el.element('nuxeo-move-documents-down-button').click();
  }

  moveUp() {
    this.el.waitForVisible('nuxeo-move-documents-up-button');
    this.el.element('nuxeo-move-documents-up-button').click();
  }

  trashDocuments() {
    const el = this.trashDocumentsButton;
    el.waitForVisible();
    el.click();
  }

  deleteDocuments() {
    const el = this.deleteDocumentsButton;
    el.waitForVisible();
    el.click();
  }

  untrashDocuments() {
    const el = this.untrashDocumentsButton;
    el.waitForVisible();
    el.click();
  }

  get trashDocumentsButton() {
    // XXX: using a more specific selector here to ensure we can check for isExisting()
    return this.el.element('nuxeo-delete-documents-button #deleteAllButton');
  }

  get untrashDocumentsButton() {
    // XXX: using a more specific selector here to ensure we can check for isExisting()
    return this.el.element('nuxeo-untrash-documents-button #untrashAllButton');
  }

  get deleteDocumentsButton() {
    // XXX: using a more specific selector here to ensure we can check for isExisting()
    return this.el.element('nuxeo-delete-documents-button[hard] #deleteAllButton');
  }
}
