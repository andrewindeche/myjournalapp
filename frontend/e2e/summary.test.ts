describe('Summary Screen Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should load summary screen', async () => {
    await expect(element(by.text('Summary'))).toBeVisible();
  });

  it('should display entry count', async () => {
    await expect(element(by.text('Total Entries:'))).toBeVisible();
  });

  it('should display date filter options', async () => {
    await expect(element(by.text('Today'))).toBeVisible();
    await expect(element(by.text('This Week'))).toBeVisible();
    await expect(element(by.text('This Month'))).toBeVisible();
    await expect(element(by.text('All Time'))).toBeVisible();
  });

  it('should display category filter', async () => {
    await expect(element(by.text('Filter by Category'))).toBeVisible();
  });

  it('should display home button', async () => {
    await expect(element(by.text('Home'))).toBeVisible();
  });

  it('should navigate to home screen', async () => {
    await element(by.text('Home')).tap();
    await expect(element(by.text('My Journal'))).toBeVisible();
  });
});