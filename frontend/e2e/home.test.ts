describe('Home Screen Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should load home screen with title', async () => {
    await expect(element(by.text('My Journal'))).toBeVisible();
  });

  it('should display add entry button', async () => {
    await expect(element(by.text('Add Entry'))).toBeVisible();
  });

  it('should display summary button', async () => {
    await expect(element(by.text('Summary'))).toBeVisible();
  });

  it('should display profile button', async () => {
    await expect(element(by.text('Profile'))).toBeVisible();
  });

  it('should show empty state message', async () => {
    await expect(element(by.text('Click on the Pencil icon to Add an Entry'))).toBeVisible();
  });

  it('should open menu on menu button tap', async () => {
    await element(by.id('menu-button')).tap();
    await expect(element(by.text('Edit Profile'))).toBeVisible();
  });

  it('should navigate to profile screen', async () => {
    await element(by.text('Profile')).tap();
    await expect(element(by.text('Profile'))).toBeVisible();
  });

  it('should navigate to summary screen', async () => {
    await element(by.text('Summary')).tap();
    await expect(element(by.text('Summary'))).toBeVisible();
  });
});