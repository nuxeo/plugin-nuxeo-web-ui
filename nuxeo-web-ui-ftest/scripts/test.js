#!/usr/bin/env node



/*
 * supported cli arguments:
 *   --cucumberReport: path to file containing the report that will be used by cucumber-html-report;
 *                     by default set to ./target/cucumber-reports/report.json
 *   --features: an array of paths from which to load feature files from;
 *               by default set to ./test/features/*.feature
 *   --junitReport: path to file containing the junit report generated from the cucumber report;
 *                  by default set to ./target/surefire-reports/TEST-report.xml
 *   --nuxeoUrl: the url of the nuxeo platform server instance to test, fall back on --url or http://localhost:8080
 *   --url: the url of the nuxeo ui instance to test
 *   --report: generate cucumber and junit reports
 *   --screenshots: save screenshots on error
 *   --screenshotPath: path to to which the screenshots will be saved;
 *                     by default set to ./target/screenshots
 *   --stepDefinitions: an array of paths from which to load step definitions from;
 *                      by default set to ./test/features/step_definitions if the path exists
 *   --tags: only scenarios containing these tags will be ran
 *   --watch: watch for changes in tests and rerun them
 *   --wdioConfig: pass a custom wdio config file
 *   --debug: allow node inspector to be attached
 *   --browser: the browser to be used (defaults to chrome)
 */

const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;
const chromeLauncher = require('chrome-launcher');
const { execSync } = require('child_process');
const fetch = require('node-fetch');

const wdioBin = require.resolve('webdriverio/bin/wdio');
const argv = require('minimist')(process.argv.slice(2));

const defaultDef = './test/features/step_definitions';

const args = [argv.wdioConfig ? argv.wdioConfig : path.join(__dirname, '../wdio.conf.js')];
args.push(`--specs=${argv.features || './test/features/*.feature'}`);

if (argv.url) {
  process.env.NUXEO_WEB_UI_URL = argv.url;
  process.env.NUXEO_URL = argv.url;
}

if (argv.nuxeoUrl) {
  process.env.NUXEO_URL = argv.nuxeoUrl;
}

if (argv.report) {
  process.env.CUCUMBER_REPORT_PATH = argv.cucumberReport ? argv.cucumberReport : './target/cucumber-reports';
  process.env.JUNIT_REPORT_PATH = argv.junitReport ? argv.junitReport : './target/surefire-reports';
}

if (argv.screenshots) {
  process.env.SCREENSHOTS_PATH = argv.screenshotPath ? argv.screenshotPath : './target/screenshots';
}

let def = '';
if (argv.stepDefinitions) {
  def = argv.stepDefinitions;
} else if (fs.existsSync(defaultDef)) {
  def = defaultDef;
}
if (def) {
  args.push(`--cucumberOpts.require=${def}/**/*.js`);
}

if (argv.watch) {
  args.push('--watch');
}

if (argv.headless) {
  process.env.HEADLESS = true;
}

if (argv.tags) {
  args.push(`--cucumberOpts.tagExpression=${argv.tags}`);
}

if (argv.debug) {
  process.env.DEBUG = true;
}

process.env.BROWSER = argv.browser || process.env.BROWSER || 'chrome';

process.env.FORCE_COLOR = true;

let done = Promise.resolve();

if (process.env.DRIVER_VERSION == null) {
  const chromePath = chromeLauncher.Launcher.getFirstInstallation();
  let version;
  try {
    version = execSync(`"${chromePath}" --version`)
      .toString()
      .trim();
  } catch (e) {
    console.error('unable to get Chrome version: ', e);
  }
  // eslint-disable-next-line no-console
  console.log(`${version} detected.`);
  const match = version && version.match(/([0-9]+)\./);
  if (match) {
    const checkVersion = match[1];
    try {
      done = fetch(`https://chromedriver.storage.googleapis.com/LATEST_RELEASE_${checkVersion}`).then((response) => {
        if (response.ok) {
          return response
            .text()
            .then((newDriverVersion) => {
              // eslint-disable-next-line no-console
              console.log(`ChromeDriver ${newDriverVersion} needed.`);
              process.env.DRIVER_VERSION = newDriverVersion;
            })
            .catch((e) => {
              console.error('unable to parse ChromeDriver version: ', e);
            });
        }
        console.error('unable to fetch ChromeDriver version: ', response);
      });
    } catch (e) {
      console.error('unable to fetch ChromeDriver version: ', e);
    }
  }
}

done.finally(() => {
  const wdio = spawn('node', [wdioBin, ...args], { env: process.env, stdio: ['inherit', 'pipe', 'pipe'] });

  wdio.stdout.pipe(process.stdout);
  wdio.stderr.pipe(process.stderr);

  wdio.on('close', (code) => {
    process.exit(code);
  });
});
