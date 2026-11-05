import { test } from 'node:test';
import assert from 'node:assert/strict';
import { __appCase__, type __AppCase__Deps } from './app-rules.ts';

function makeDeps(): __AppCase__Deps {
  return {
    // in-memory repositories, fixed clock, deterministic ids
  };
}

test('__app-case__: success path', async () => {
  const result = await __appCase__({ /* ... */ }, makeDeps());
  assert.equal(result.ok, true);
});

// One test per error code:
test('__app-case__: fails with SOMETHING_NOT_FOUND when ...', async () => {
  const result = await __appCase__({ /* ... */ }, makeDeps());
  assert.equal(!result.ok && result.error, 'SOMETHING_NOT_FOUND');
});
