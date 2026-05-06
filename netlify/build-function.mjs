import { build } from "esbuild";
import { mkdirSync } from "fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

globalThis.require = createRequire(import.meta.url);

const root = path.dirname(fileURLToPath(import.meta.url));

mkdirSync(path.join(root, "functions"), { recursive: true });

await build({
  entryPoints: [path.join(root, "function-src/api.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  format: "esm",
  outfile: path.join(root, "functions/api.mjs"),
  // CJS compat shim so bundled CJS packages work in ESM output
  banner: {
    js: `import { createRequire as __cr } from 'node:module';
import __path from 'node:path';
import __url from 'node:url';
globalThis.require = __cr(import.meta.url);
globalThis.__filename = __url.fileURLToPath(import.meta.url);
globalThis.__dirname = __path.dirname(globalThis.__filename);`,
  },
  // Resolve deps from api-server's own node_modules first
  nodePaths: [path.resolve(root, "../artifacts/api-server/node_modules")],
  external: [
    "*.node",
    "pg-native",
    "sharp",
    "better-sqlite3",
    "sqlite3",
    "canvas",
    "bcrypt",
    "argon2",
    "fsevents",
    "re2",
    "bufferutil",
    "utf-8-validate",
    "@google-cloud/*",
    "@aws-sdk/*",
    "@azure/*",
    "firebase-admin",
    "oracledb",
    "mongodb-client-encryption",
    "mysql2",
    "sequelize",
    // pino-pretty is dev-only; skip transport worker in serverless
    "pino-pretty",
  ],
  logLevel: "info",
});

console.log("✓ Netlify API function bundled → netlify/functions/api.mjs");
