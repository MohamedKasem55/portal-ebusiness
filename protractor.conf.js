// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
  allScriptsTimeout: 99000,
  specs: [
    './e2e/test/**/*.feature'
  ],
  capabilities: {
    'browserName': 'chrome'
  },
  //baseUrl: 'http://localhost:4201/',
  directConnect: true,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    require: ['./e2e/steps/**/*.ts','./e2e/support/**/*.ts'],
    tags: [],
    compiler: 'ts:ts-node/register',
    format: ['json:e2e/reports/summary.json'    ],
    dryRun: false,
  },
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    //browser.baseUrl = 'http://localhost:4201/';
    //jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
  }
};