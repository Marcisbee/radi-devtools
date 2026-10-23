const revision = 'bc7e0b7d5c1fc4474cebdf2a194437d40907ad0a';
const root = new URL('../', import.meta.url).pathname;
const runtime = `${root}.radi`;
const patch = `${root}integration/radi.patch`;

async function git(args: string[], cwd = runtime) {
  const result = await new Deno.Command('git', {
    args, cwd, stdout: 'piped', stderr: 'piped',
  }).output();
  if (!result.success) throw new Error(new TextDecoder().decode(result.stderr));
  return new TextDecoder().decode(result.stdout).trim();
}

try {
  await Deno.stat(runtime);
} catch (error) {
  if (!(error instanceof Deno.errors.NotFound)) throw error;
  await git(['clone', 'https://github.com/Marcisbee/radi.git', runtime], root);
  await git(['checkout', '--detach', revision]);
}
if (await git(['rev-parse', 'HEAD']) !== revision) {
  throw new Error('The .radi checkout differs from the pinned revision; use a fresh checkout.');
}
try {
  await git(['apply', '--reverse', '--check', patch]);
  console.log('Radi runtime integration is already installed.');
} catch {
  await git(['apply', '--check', patch]);
  await git(['apply', patch]);
  console.log('Installed the development-only Radi render instrumentation.');
}
