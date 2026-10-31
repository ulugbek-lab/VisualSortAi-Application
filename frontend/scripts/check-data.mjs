import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
const directory = mkdtempSync(join(tmpdir(), "visualsort-check-"));
try {
  const compile = spawnSync(
    process.execPath,
    [
      "node_modules/typescript/bin/tsc",
      "src/analytics.ts",
      "src/storage.ts",
      "--outDir",
      directory,
      "--module",
      "commonjs",
      "--moduleResolution",
      "node",
      "--target",
      "ES2022",
      "--skipLibCheck",
      "--strict",
    ],
    { stdio: "inherit" },
  );
  if (compile.status !== 0) process.exitCode = 1;
  else {
    const check = spawnSync(process.execPath, ["tests/data.cjs", directory], {
      stdio: "inherit",
    });
    process.exitCode = check.status ?? 1;
  }
} finally {
  rmSync(directory, { recursive: true, force: true });
}
