const Nuxeo = require('nuxeo');
export default new Nuxeo({ auth: { method: 'basic', username: 'Administrator', password: 'Administrator' } });