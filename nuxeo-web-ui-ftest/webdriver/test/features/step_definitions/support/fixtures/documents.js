import nuxeo from '../services/client'
import {Blob} from 'nuxeo'
import fs from 'fs'
import path from 'path'

global.liveDocuments = [];

fixtures.documents = {
  init: (type = 'File', title = 'my document') => {
    return {
      'entity-type': 'document',
      name: title.replace(/[^a-z0-9.]/gi, '_'),
      type: type.trim(),
      properties: {
        'dc:title': title,
      }
    };
  },
  create: (parent, document) => {
    return nuxeo.repository().create(parent, document).then((doc) => {
      liveDocuments.push(doc.path);
      return doc;
    });
  },
  setPermissions: (document, permission, username) => {
    return nuxeo.operation('Document.AddPermission').input(document.uid).params({
      permission: permission,
      username: username
    }).execute();
  },
  delete: (path) => {
    return nuxeo.repository().delete(path).then(() => {
      liveDocuments.splice(liveDocuments.indexOf(path), 1);
    });
  },
  import: (parent, blobPath) => {
    const stats = fs.statSync(blobPath);
    const file = fs.createReadStream(blobPath);
    const blob = new Blob({
      content: file,
      name: path.basename(blobPath),
      size: stats.size,
    });
    const params = {
      context: {
        currentDocument: parent.path
      }
    }
    const uploader = nuxeo.batchUpload();
    return uploader.upload(blob).then(() => {
      return nuxeo.operation('FileManager.Import')
          .input(uploader)
          .context(params.context)
          .params(params)
          .execute({headers: {nx_es_sync: "true"}})
          .then((docs) => {
            const doc = docs.entries[0];
            liveDocuments.push(doc.path);
            return doc;
          });
    });
  }
};

module.exports = function () {

  this.Before(() => nuxeo.repository().fetch('/default-domain').then((doc) => { this.doc = doc; }));

  this.After(() => Promise.all(liveDocuments.map((doc) => {
    if (path.dirname(doc) === '/default-domain') {
      nuxeo.repository().delete(doc);
    }
  })).then(() => {
    liveDocuments = [];
  }));
};