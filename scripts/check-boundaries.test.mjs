import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { checkBoundaries, extractSpecifiers } from './check-boundaries.mjs';

function rulesFor(files) {
  const root = mkdtempSync(join(tmpdir(), 'boundaries-'));
  try {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    }
    return checkBoundaries(root).map((v) => v.rule).sort();
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('extractSpecifiers finds static, type, re-export and dynamic imports, ignoring comments', () => {
  const code = `
    import a from './a.ts';
    import type { B } from "./b.ts";
    import {
      c1,
      c2,
    } from './c.ts';
    export { d } from './d.ts';
    import './e.ts';
    const f = await import('./f.ts');
    // import g from './g.ts';
  `;
  assert.deepEqual(extractSpecifiers(code), ['./a.ts', './b.ts', './c.ts', './d.ts', './e.ts', './f.ts']);
});

test('a valid layout has no violations', () => {
  assert.deepEqual(
    rulesFor({
      'shared/result.ts': `export {}`,
      'modules/users/domain/user.ts': `import '../../../shared/result.ts';`,
      'modules/users/repository/repo.ts': `import '../domain/user.ts';`,
      'modules/users/app-cases/sign-up/app-rules.ts': `import '../../domain/user.ts'; import '../../repository/repo.ts';`,
      'modules/users/app-cases/sign-up/http-controller.ts': `import './app-rules.ts';`,
      'modules/users/index.ts': `export * from './app-cases/sign-up/http-controller.ts';`,
      'main/app.ts': `import '../modules/users/index.ts';`,
    }),
    [],
  );
});

test('R1: an app case cannot import a sibling app case', () => {
  assert.deepEqual(
    rulesFor({
      'modules/users/app-cases/a/app-rules.ts': `import '../b/app-rules.ts';`,
      'modules/users/app-cases/b/app-rules.ts': `export {}`,
    }),
    ['slice-isolation'],
  );
});

test('R2: domain cannot import repository or app cases', () => {
  assert.deepEqual(
    rulesFor({
      'modules/users/domain/user.ts': `import '../repository/repo.ts';`,
      'modules/users/repository/repo.ts': `export {}`,
    }),
    ['domain-purity'],
  );
});

test('R3: other modules must be imported through index.ts', () => {
  assert.deepEqual(
    rulesFor({
      'modules/posts/app-cases/x/app-rules.ts': `import '../../../users/domain/user.ts'; import '../../../users/index.ts';`,
      'modules/users/domain/user.ts': `export {}`,
      'modules/users/index.ts': `export {}`,
    }),
    ['module-api'],
  );
});

test('R4 and R5: shared is a leaf and modules do not import main', () => {
  assert.deepEqual(
    rulesFor({
      'shared/http.ts': `import '../modules/users/index.ts';`,
      'modules/users/index.ts': `import '../../main/app.ts';`,
      'main/app.ts': `export {}`,
    }),
    ['no-root-import', 'shared-is-leaf'],
  );
});
