describe('Registration Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should load register screen with title', async () => {
    await element(by.text('Sign up')).tap();
    await expect(element(by.text('Create an Account'))).toBeVisible();
  });

  it('should display username input', async () => {
    await expect(element(by.text('Username'))).toBeVisible();
  });

  it('should display email input', async () => {
    await expect(element(by.text('Email'))).toBeVisible();
  });

  it('should display password input', async () => {
    await expect(element(by.text('Password'))).toBeVisible();
  });

  it('should display confirm password input', async () => {
    await expect(element(by.text('Confirm Password'))).toBeVisible();
  });

  it('should display register button', async () => {
    await expect(element(by.text('Register'))).toBeVisible();
  });

  it('should display sign in link', async () => {
    await expect(element(by.text('Already have an account? Sign in'))).toBeVisible();
  });

  it('should show error for mismatched passwords', async () => {
    await element(by.text('Username')).typeText('testuser');
    await element(by.text('Email')).typeText('testuser@gmail.com');
    await element(by.text('Password')).typeText('TestPass123');
    await element(by.text('Confirm Password')).typeText('DifferentPass123');
    await element(by.text('Register')).tap();
    await expect(element(by.text('Passwords do not match'))).toBeVisible();
  });

  it('should show error for invalid email domain', async () => {
    await element(by.text('Username')).typeText('testuser2');
    await element(by.text('Email')).typeText('testuser@custom.com');
    await element(by.text('Password')).typeText('TestPass123');
    await element(by.text('Confirm Password')).typeText('TestPass123');
    await element(by.text('Register')).tap();
    await expect(element(by.text('Please use a valid email'))).toBeVisible();
  });

  it('should navigate back to login', async () => {
    await element(by.text('Already have an account? Sign in')).tap();
    await expect(element(by.text('Welcome to your journal'))).toBeVisible();
  });
});