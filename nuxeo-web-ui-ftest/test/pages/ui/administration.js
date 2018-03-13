'use strict';

import BasePage from '../base';
import Vocabulary from './admin/vocabulary';
import CloudServices from './admin/cloudServices';

export default class Administration extends BasePage {

  get analytics() {
    return this.el.element('nuxeo-analytics');
  }

  get userAndGroupManagement() {
    return this.el.element('nuxeo-user-group-management');
  }

  get userGroupCreateButton() {
    return this.el.element('#createButton');
  }

  get vocabularyManagement() {
    if (!browser.getUrl().endsWith('vocabulary-management')) {
      driver.url(process.env.NUXEO_URL ? '#!/admin/vocabulary-management' : 'ui/#!/admin/vocabulary-management');
    }
    return new Vocabulary('nuxeo-vocabulary-management');
  }

  goToVocabularyManagement() {
    if (!browser.getUrl().endsWith('vocabulary-management')) {
      driver.url(process.env.NUXEO_URL ? '#!/admin/vocabulary-management' : 'ui/#!/admin/vocabulary-management');
    }
    return this.vocabularyManagement;
  }

  get audit() {
    return this.el.element('nuxeo-audit');
  }

  get cloudServices() {
    return new CloudServices('nuxeo-cloud-services');
  }

  goToCloudServices() {
    console.log('goToCloudServices start');
    if (!browser.getUrl().endsWith('cloud-services')) {
      console.log('goToCloudServices updating url start');
      console.log('goToCloudServices process.env.NUXEO_URL=');
      console.log(process.env.NUXEO_URL);
      driver.url(process.env.NUXEO_URL ? '#!/admin/cloud-services' : 'ui/#!/admin/cloud-services');
      console.log('goToCloudServices updating url end');
    }
    console.log('goToCloudServices end');
    return this.cloudServices;
  }

}
