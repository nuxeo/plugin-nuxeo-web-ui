'use strict';

import Login from '../../pages/login';
import UI from '../../pages/ui';
var Nuxeo = require('nuxeo');

module.exports = function () {

  this.Given('there is a user "$username" in group "$group"', (username, group) => {
    return fixtures.users.create({
      'entity-type': 'user',
      properties: {
        username: username,
        firstName: username,
        password: fixtures.users.DEFAULT_PASSWORD,
        groups: [group],
      },
    });
  });

  this.When('I login as "$username"', (username) => {
    const login = Login.get();
    login.username = username;
    login.password = users[username];
    login.submit();
    this.username = username;
    this.ui = UI.get();
  });

  this.When(/^I visit (.*)$/, (url) => driver.url(url));

  this.When('I logout', () => Login.get());

  this.Then('I am logged in as "$username"', (username) => {
    const currentUser = this.ui.drawer.open('profile').getText('.title').toLowerCase();
    currentUser.should.be.equal(username.toLowerCase());
  });

  this.Then('I am logged out', () => driver.isVisible('#username').should.be.true);
};
