describe('Journal Entry Flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should display title input field', async () => {
    await expect(element(by.text('Add your title here'))).toBeVisible();
  });

  it('should display note input field', async () => {
    await expect(element(by.text('Add your note here'))).toBeVisible();
  });

  it('should display category input field', async () => {
    await expect(element(by.text('Enter category'))).toBeVisible();
  });

  it('should display theme selector', async () => {
    await expect(element(by.text('Theme:'))).toBeVisible();
  });

  it('should display all theme options', async () => {
    await expect(element(by.text('Default'))).toBeVisible();
    await expect(element(by.text('Ocean'))).toBeVisible();
    await expect(element(by.text('Sunset'))).toBeVisible();
    await expect(element(by.text('Forest'))).toBeVisible();
    await expect(element(by.text('Lavender'))).toBeVisible();
    await expect(element(by.text('Mint'))).toBeVisible();
  });

  it('should display image upload button', async () => {
    await expect(element(by.id('image-button'))toBeVisible();
  });

  it('should display camera button', async () => {
    await expect(element(by.id('camera-button')).toBeVisible();
  });

  it('should display save changes button', async () => {
    await expect(element(by.text('Save Changes'))).toBeVisible();
  });

  it('should select theme on tap', async () => {
    await element(by.text('Ocean')).tap();
    await expect(element(by.text('Ocean'))).toHaveAttr('selected');
  });

  it('should show save button disabled initially', async () => {
    const saveBtn = element(by.text('Save Changes'));
    await expect(saveBtn).toHaveAttr('enabled', false);
  });

  it('should enable save when text entered', async () => {
    await element(by.text('Add your note here')).typeText('My test entry');
    await element(by.text('Enter category')).typeText('Personal');
    const saveBtn = element(by.text('Save Changes'));
    await expect(saveBtn).toHaveAttr('enabled', true);
  });

  it('should save entry successfully', async () => {
    await element(by.text('Add your title here')).typeText('Test Title');
    await element(by.text('Add your note here')).typeText('Test content');
    await element(by.text('Enter category')).typeText('Test');
    await element(by.text('Save Changes')).tap();
    await expect(element(by.text('Loading...'))).toBeVisible();
  });
});