exports.config = {
    runner: 'local',
    specs: ['./e2e/**/*.spec.js'],
    maxInstances: 1,
    capabilities: [
      {
        platformName: 'Android',
        'appium:deviceName': 'MyAndroidDevice',
        'appium:app': '/path/to/your/app.apk',
        'appium:automationName': 'UiAutomator2'
      }
    ],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['appium'],
    framework: 'mocha',
    reporters: ['spec']
  };
  