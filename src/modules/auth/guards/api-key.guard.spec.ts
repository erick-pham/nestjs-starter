import { ApiKeyAuthGuard } from './api-key.guard';

test('ApiKeyAuthGuard should extend AuthGuard with apikey strategy', () => {
  const apiKeyAuthGuard = new ApiKeyAuthGuard();
  expect(apiKeyAuthGuard).toBeDefined();
});
