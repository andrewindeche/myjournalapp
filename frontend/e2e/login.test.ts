describe('Login Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should load login screen with title', async () => {
    await expect(element(by.text('Welcome to your journal'))).toBeVisible();
  });

  it('should display username input field', async () => {
    await expect(element(by.text('Your Username'))).toBeVisible();
    await expect(element(by.type('TextInput'))).atIndex(0).toBeVisible();
  });

  it('should display password input field', async () => {
    await expect(element(by.text('Password'))).toBeVisible();
    await expect(element(by.type('TextInput'))).atIndex(1).toBeVisible();
  });

  it('should display sign in button', async () => {
    await expect(element(by.text('Sign In'))).toBeVisible();
  });

  it('should display google sign in button', async () => {
    await expect(element(by.text('Google Sign In'))).toBeVisible();
  });

  it('should show new user signup link', async () => {
    await expect(element(by.text("I'm a new user"))).toBeVisible();
  });

  it('should navigate to register screen on signup tap', async () => {
    await element(by.text('Sign up')).tap();
    await expect(element(by.text('Create an Account'))).toBeVisible();
  });

  it('should show error for empty credentials', async () => {
    await element(by.text('Sign In')).tap();
    await expect(element(by.text('Username may not be blank'))).toBeVisible();
  });

  it('should have disabled sign in when inputs empty', async () => {
    const signInBtn = element(by.text('Sign In'));
    await expect(signInBtn).toHaveAttr('enabled', false);
  });
});