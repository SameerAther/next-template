#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const DEFAULT_TEMPLATE = "next-basic-auth";

function usage() {
  console.log(
    [
      "create-next-template <target-dir> [--template <name>] [--force] [--dry-run]",
      "",
      "Examples:",
      "  create-next-template my-app",
      "  create-next-template my-app --template next-basic-auth",
      "  create-next-template my-app --dry-run",
      "",
      "Templates:",
      ...fs
        .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => `  - ${d.name}`),
    ].join("\n")
  );
}

function parseArgs(argv) {
  const args = argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    return { help: true };
  }

  const targetDir = args[0];
  let template = DEFAULT_TEMPLATE;
  let force = false;
  let dryRun = false;

  for (let i = 1; i < args.length; i++) {
    const a = args[i];
    if (a === "--force") force = true;
    if (a === "--dry-run") dryRun = true;
    if (a === "--template") template = args[i + 1];
  }

  return { targetDir, template, force, dryRun };
}

function ensureEmptyOrForce(dir, force) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  if (items.length === 0) return;
  if (!force) {
    throw new Error(
      `Target directory is not empty: ${dir} (use --force to overwrite)`
    );
  }
  fs.rmSync(dir, { recursive: true, force: true });
}

function walkFiles(rootDir) {
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile()) out.push(fullPath);
    }
  }
  return out;
}

function copyTemplate(templateDir, targetDir, appName, { dryRun }) {
  if (dryRun) return;
  fs.mkdirSync(targetDir, { recursive: true });
  const files = walkFiles(templateDir);

  for (const src of files) {
    const rel = path.relative(templateDir, src);
    const dst = path.join(targetDir, rel);
    fs.mkdirSync(path.dirname(dst), { recursive: true });

    const isText =
      rel.endsWith(".ts") ||
      rel.endsWith(".tsx") ||
      rel.endsWith(".js") ||
      rel.endsWith(".json") ||
      rel.endsWith(".md") ||
      rel.endsWith(".env") ||
      rel.endsWith(".txt") ||
      rel.endsWith(".gitignore") ||
      rel.endsWith(".mjs");

    if (!isText) {
      fs.copyFileSync(src, dst);
      continue;
    }

    const raw = fs.readFileSync(src, "utf8");
    const replaced = raw
      .replaceAll("__APP_NAME__", appName)
      .replaceAll("__PACKAGE_NAME__", appName);
    fs.writeFileSync(dst, replaced, "utf8");
  }
}

function main() {
  const { help, targetDir, template, force, dryRun } = parseArgs(process.argv);
  if (help) {
    usage();
    process.exit(0);
  }

  const resolvedTarget = path.resolve(process.cwd(), targetDir);
  const templateDir = path.join(TEMPLATES_DIR, template);
  if (!fs.existsSync(templateDir)) {
    console.error(`Unknown template: ${template}`);
    usage();
    process.exit(1);
  }

  const appName = path.basename(resolvedTarget);

  if (!dryRun) {
    ensureEmptyOrForce(resolvedTarget, force);
  }

  const files = walkFiles(templateDir).map((src) =>
    path.relative(templateDir, src)
  );

  if (dryRun) {
    console.log(`Template: ${template}`);
    console.log(`Target:   ${resolvedTarget}`);
    console.log(`App name: ${appName}`);
    console.log("");
    console.log("Files:");
    for (const f of files.sort()) console.log(`  - ${f}`);
    process.exit(0);
  }

  copyTemplate(templateDir, resolvedTarget, appName, { dryRun });

  console.log(`Created: ${resolvedTarget}`);
  console.log("Next steps:");
  console.log(`  cd ${targetDir}`);
  console.log("  npm install");
  console.log("  npm run dev");
}

main();

