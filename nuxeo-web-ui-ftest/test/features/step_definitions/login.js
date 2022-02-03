import {
  Given,
  Then,
  When,
} from 'cucumber';
import Login from '../../pages/login';
import UI from '../../pages/ui';

Given('user {string} exists in group {string}', (username, group) => fixtures.users.create(
  {
    'entity-type': 'user',
    properties: {
      username,
      firstName: username,
      password: fixtures.users.DEFAULT_PASSWORD,
      groups: [group],
    },
  },
));

Given('user {string} exists', username => fixtures.users.create(
  {
    'entity-type': 'user',
    properties: {
      username,
      firstName: username,
      password: fixtures.users.DEFAULT_PASSWORD,
    },
  },
));
/* eslint-disable no-console */
When('I login as {string}', { wrapperOptions: { retry: 3 } }, function (username) {
  browser.pause(1000);
  const login = Login.get();
  console.log('will set username');
  login.username = username;
  console.log('username set');
  console.log('will set password');
  login.password = users[username];
  console.log('password set');
  console.log('will submit login');
  login.submit();
  console.log('login submitted');
  this.username = username;
  this.ui = UI.get();
  console.log('will wait for nuxeo-page');
  driver.waitForVisible('nuxeo-page');
  console.log('nuxeo-page loaded');
});

When(/^I visit (.*)$/, url => driver.url(url));

When('I logout', () => Login.get());

Then('I am logged in as {string}', function (username) {
  const currentUser = this.ui.drawer.open('profile').getText('.header').toLowerCase();
  currentUser.should.be.equal(username.toLowerCase());
});

Then('I am logged out', () => driver.isVisible('#username').should.be.true);
