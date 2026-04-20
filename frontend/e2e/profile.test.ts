describe('Profile Screen Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should load profile screen', async () => {
    await expect(element(by.text('Profile'))).toBeVisible();
  });

  it('should display username field', async () => {
    await expect(element(by.text('Username'))).toBeVisible();
  });

  it('should display email field', async () => {
    await expect(element(by.text('Email'))).toBeVisible();
  });

  it('should display edit profile button', async () => {
    await expect(element(by.text('Edit Profile'))).toBeVisible();
  });

  it('should display change password button', async () => {
    await expect(element(by.text('Change Password'))).toBeVisible();
  });

  it('should display logout button', async () => {
    await expect(element(by.text('Logout'))).toBeVisible();
  });

  it('should display dark mode toggle', async () => {
    await expect(element(by.text('Dark Mode'))).toBeVisible();
  });

  it('should toggle dark mode on tap', async () => {
    await element(by.text('Dark Mode')).tap();
    await element(by.text('Light Mode')).tap();
  });

  it('should show delete account option', async () => {
    await expect(element(by.text('Delete Account'))).toBeVisible();
  });

  it('should navigate back to home', async () => {
    await element(by.id('back-button')).tap();
    await expect(element(by.text('My Journal'))).toBeVisible();
  });
});