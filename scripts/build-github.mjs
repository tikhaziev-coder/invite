import { rename } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const apiRoute = resolve('app/api/rsvp/route.ts');
const temporaryApiRoute = resolve('app/api/rsvp/route.sites.ts');
const nextCli = resolve('node_modules/next/dist/bin/next');

await rename(apiRoute, temporaryApiRoute);

let exitCode = 1;
try {
  const result = spawnSync(process.execPath, [nextCli, 'build'], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  exitCode = result.status ?? 1;
} finally {
  await rename(temporaryApiRoute, apiRoute);
}

process.exit(exitCode);
