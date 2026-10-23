import { spawn } from 'node:child_process';

const root = process.cwd();
const commonEnv = { ...process.env, MYSQL_URL: process.env.MYSQL_URL };
const medar = spawn(process.execPath, ['server/medar-api.mjs'], {
  cwd: root,
  env: { ...commonEnv, MEDAR_PORT: '8788', MEDAR_HOST: '127.0.0.1' },
  stdio: 'inherit',
});
const site = spawn(process.execPath, ['server/index.mjs'], {
  cwd: root,
  env: { ...commonEnv, MEDAR_API_URL: 'http://127.0.0.1:8788' },
  stdio: 'inherit',
});

let stopping = false;
let exitCode = 0;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  exitCode = code;
  if (site.exitCode === null) site.kill('SIGTERM');
  if (medar.exitCode === null) medar.kill('SIGTERM');
  const timeout = setTimeout(() => {
    if (site.exitCode === null) site.kill('SIGKILL');
    if (medar.exitCode === null) medar.kill('SIGKILL');
    process.exit(exitCode || 1);
  }, 8000);
  timeout.unref();
  let remaining = 0;
  const finished = () => {
    remaining -= 1;
    if (remaining <= 0) {
      clearTimeout(timeout);
      process.exitCode = exitCode;
    }
  };
  for (const child of [site, medar]) {
    if (child.exitCode !== null) continue;
    remaining += 1;
    child.once('exit', finished);
  }
  if (remaining === 0) process.exitCode = exitCode;
}
site.on('error', (error) => { console.error('Raz Sahra server failed to start:', error.message); stop(1); });
medar.on('error', (error) => { console.error('Medar API failed to start:', error.message); stop(1); });
site.on('exit', (code) => { if (!stopping) stop(code || 1); });
medar.on('exit', (code) => { if (!stopping) stop(code || 1); });
process.on('SIGTERM', () => stop(0));
process.on('SIGINT', () => stop(0));
