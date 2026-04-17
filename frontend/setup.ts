import detox from 'detox';
import { device } from 'detox';

beforeAll(async () => {
  await device.launchApp();
});

beforeEach(async () => {
  await device.reloadReactNative();
});