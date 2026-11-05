import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const marketplace = JSON.parse(readFileSync(join(root, '.claude-plugin/marketplace.json'), 'utf8'));

test('every skill folder is published by a plugin in the marketplace', () => {
  const published = marketplace.plugins.flatMap((p) => p.skills ?? []).map((s) => s.replace(/^\.\//, ''));
  const onDisk = readdirSync(join(root, 'skills')).map((name) => `skills/${name}`);
  assert.deepEqual(published.sort(), onDisk.sort());
});

test('every published skill has a SKILL.md whose name matches its folder', () => {
  for (const plugin of marketplace.plugins) {
    for (const skill of plugin.skills ?? []) {
      const file = join(root, skill, 'SKILL.md');
      assert.ok(existsSync(file), `${file} is missing`);
      const name = readFileSync(file, 'utf8').match(/^name:\s*(.+)$/m)?.[1].trim();
      assert.equal(name, skill.split('/').at(-1));
    }
  }
});
