const wd = require('wd');
const assert = require('assert');

const driver = wd.promiseChainRemote('http://localhost:4723/wd/hub');

describe('HomeScreen E2E Test', function () {
  this.timeout(30000);

  before(async () => {
    await driver.init({
      platformName: 'Android', 
      deviceName: 'Android Emulator', 
      appPackage: 'com.yourappname',
      appActivity: 'com.yourappname.MainActivity',
      automationName: 'UiAutomator2' 
    });
  });

  it('should navigate to Sign In page on Sign In button press', async () => {
    const signInButton = await driver.elementByAccessibilityId('Sign In');
    await signInButton.click();
    // Add assertions to verify navigation
  });

  it('should navigate to Register page on Register button press', async () => {
    const registerButton = await driver.elementByAccessibilityId('Register');
    await registerButton.click();
    // Add assertions to verify navigation
  });

  after(async () => {
    await driver.quit();
  });
});
