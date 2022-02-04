import {
  After,
  Before,
} from 'cucumber';
import nuxeo, { BlobHelper } from '../services/client';

global.liveDocuments = [];

fixtures.documents = {
  init: (type = 'File', title = 'my document') => {
    const doc = {
      'entity-type': 'document',
      name: title.replace(/[^a-z0-9.]/gi, '_'),
      type: type.trim(),
      properties: {
        'dc:title': title,
      },
    };
    if (type === 'Note') {
      doc.properties['note:mime_type'] = 'text/html';
      doc.properties['note:note'] = '';
    }
    return doc;
  },
  create: (parent, document) => nuxeo.repository().create(parent, document).then((doc) => {
    liveDocuments.push(doc.uid);
    return doc;
  }),
  createWithAuthor: (parent, document, username) => nuxeo.repository()
    .create(parent, document)
    .then((doc) => {
      liveDocuments.push(doc.uid);
      if (username) {
        return doc.set({
          'dc:creator': username,
        }).save();
      }
      return doc;
    }),
  addTag: (document, tag) => nuxeo.operation('Services.TagDocument')
    .input(document)
    .params({
      tags: tag,
    })
    .execute()
    .catch((error) => {
      throw new Error(error);
    }),
  createVersion: (document, versionType) => nuxeo.operation('Document.CreateVersion').input(document.uid).params({
    increment: versionType,
    saveDocument: true,
  }).execute(),
  setPermissions: (document, permission, username) => nuxeo.operation('Document.AddPermission')
    .input(typeof document === 'string' ? document : document.uid).params({
      permission,
      username,
    }).execute(),
  delete: document => nuxeo.repository().delete(document.path).then(() => {
    liveDocuments.splice(liveDocuments.indexOf(document.uid), 1);
  }),
  trash: document => nuxeo.operation('Document.Trash').input(document.uid).execute().then(doc => doc),
  attach: (document, blobPath, asAttachment = false) => {
    const blob = BlobHelper.fromPath(blobPath);
    const uploader = nuxeo.batchUpload();
    return uploader.upload(blob).then((result) => {
      if (asAttachment) {
        const params = {
          useMainBlob: false,
          context: {
            currentDocument: document.path,
          },
        };
        return nuxeo.operation('BlobHolder.AttachOnCurrentDocument')
          .input(uploader)
          .context(params.context)
          .params(params)
          .execute({ headers: { nx_es_sync: 'true' } });
      } else {
        document.properties['file:content'] = {
          'upload-batch': result.blob['upload-batch'],
          'upload-fileId': '0',
        };
        return nuxeo.repository().update(document);
      }
    });
  },
  import: (parent, blobPath) => {
    const blob = BlobHelper.fromPath(blobPath);
    const params = {
      context: {
        currentDocument: parent.path,
      },
    };
    const uploader = nuxeo.batchUpload();
    return uploader.upload(blob).then(() => nuxeo.operation('FileManager.Import')
      .input(uploader)
      .context(params.context)
      .params(params)
      .execute({ headers: { nx_es_sync: 'true' } })
      .then((docs) => {
        const doc = docs.entries[0];
        liveDocuments.push(doc.uid);
        return doc;
      }));
  },
  getDocument: ref => nuxeo.repository().fetch(ref),
};

Before(function () {
  return nuxeo.repository().fetch('/default-domain').then((doc) => { this.doc = doc; });
});

function _retry(fn, retries = 3, interval = 100) {
  return new Promise((resolve, reject) => fn()
    .then(resolve)
    .catch(
      error => setTimeout(() => {
        if (retries === 0) {
          reject(error);
          return;
        }
        _retry(fn, --retries, interval).then(resolve, reject);
      }),
      interval,
    ),);
}

function _sequencer(promises) {
  return promises.reduce((current, next) => current.then(next), Promise.resolve());
}

let nResets = 0;
/* eslint-disable no-console */
function reset() {
  nResets++;
  // eslint-disable-next-line no-console
  console.log('started reset ', nResets);
  const deletions = liveDocuments.reverse().map((docUid, index) => () => _retry(() => {
    console.log('deleting ', docUid, ' (', index, '/', liveDocuments.length, ')');
    return nuxeo
      .repository()
      .delete(docUid)
      .catch((e) => {
        const { status, statusText, url } = e.response;
        // eslint-disable-next-line no-console
        console.error(`${status} ${statusText} ${url}`);
        // in case of a conflict
        if (status === 409) {
          throw e;
        }
      });
  }));
  const res = _sequencer(deletions)
    .then(() => {
      liveDocuments = [];
      console.log('completed reset ', nResets);
    })
    // eslint-disable-next-line no-console
    .catch((e) => {
      console.error(e);
      console.log('failed reset ', nResets);
    });
  // eslint-disable-next-line no-console
  return res;
}

After(reset);
