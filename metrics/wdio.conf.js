exports.capabilities = {
  chrome: {
      desiredCapabilities: {
          browserName: 'chrome',
          platform: 'Windows 10',
          version: '',
      }
  },
  firefox: {
      desiredCapabilities: {
          browserName: 'firefox',
          platform: 'Windows 10',
          version: '',
      }
  },
  firefoxNightly: {
    desiredCapabilities: {
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'dev',
    }
  },
  safari: {
      desiredCapabilities: {
          browserName: 'safari',
          version: '',
      }
  },
  edge: {
      desiredCapabilities: {
          browserName: 'microsoftedge',
          version: ''
      }
  }
};