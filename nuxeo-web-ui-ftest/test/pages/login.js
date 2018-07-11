const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');

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
    //  For investigation purposes
    mkdirp.sync(process.env.SCREENSHOTS_PATH);
    const fileName = path.join(process.env.SCREENSHOTS_PATH,
        `loginScreen${new Date().getTime().toString()}(INVESTIGATION).png`);
    const screenshot = driver.saveScreenshot();
    fs.writeFileSync(fileName, screenshot);
    //  End
    return new this();
  }

}
