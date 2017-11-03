'use strict';

export default class Login {

  set username(username) {
    driver.element('#username').setValue(username);
  }

  set password(password) {
    driver.element('#password').setValue(password);
  }

  submit() {
    return driver.click('[name="Submit"]');
  }

  static get() {
    const baseUrl = process.env.NUXEO_URL || '';
    driver.url(baseUrl ? `${baseUrl}/logout` : 'logout');
    return new this();
  }

}
