describe('Forgot Password Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show forgot password link on login screen', async () => {
    await expect(element(by.text('Forgot Password?'))).toBeVisible();
  });

  it('should navigate to forgot password screen', async () => {
    await element(by.text('Forgot Password?')).tap();
    await expect(element(by.text('Forgot Password'))).toBeVisible();
  });

  it('should show email input on forgot password screen', async () => {
    await element(by.text('Forgot Password?')).tap();
    await expect(element(by.text('Email Address'))).toBeVisible();
  });

  it('should show send reset code button', async () => {
    await element(by.text('Forgot Password?')).tap();
    await expect(element(by.text('Send Reset Code'))).toBeVisible();
  });

  it('should show error for empty email', async () => {
    await element(by.text('Forgot Password?')).tap();
    await element(by.text('Send Reset Code')).tap();
    await expect(element(by.text('Please enter your email address.'))).toBeVisible();
  });

  it('should show back to email link when code step is active', async () => {
    await element(by.text('Forgot Password?')).tap();
    await element(by.text('Send Reset Code')).tap();
    await expect(element(by.text('Back to Email'))).toBeVisible();
  });
});
