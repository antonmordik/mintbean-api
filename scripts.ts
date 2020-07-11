function run([name, ...args]: string[], tasks: { [name: string]: Function }) {
  name in tasks
    ? tasks[name](...args)
    : console.log(`Task "${name}" not found`);
}

async function exec(args: string[]) {
  const proc = await Deno.run({ cmd: args }).status();

  if (proc.success == false) {
    Deno.exit(proc.code);
  }

  return proc;
}

run(Deno.args, {
  async start() {
    await exec(
      [
        "deno",
        "run",
        "--allow-read",
        "--allow-write",
        "--allow-net",
        "--allow-plugin",
        "--unstable",
        "server.ts",
      ],
    );
  },
});
