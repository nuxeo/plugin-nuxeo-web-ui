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
    const date = new Date();
    const fileName = path.join(process.env.SCREENSHOTS_PATH,
        `loginScreen_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}
        (INVESTIGATION).png`);
    const screenshot = driver.saveScreenshot();
    fs.writeFileSync(fileName, screenshot);
    //  End
    return new this();
  }

}
