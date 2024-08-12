import detox from 'detox';
import config from '../detox.config';

beforeAll(async () => {
  await detox.init(config);
});

afterAll(async () => {
  await detox.cleanup();
});
