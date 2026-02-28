#!/usr/bin/env node

const path = require("path");
const argv = process.argv.slice(2);
const projectDir = process.cwd();

async function main() {
  try {
    const { Plop, run } = await import("plop");

    const configPath = path.join(__dirname, "../plopfile.js");
    
    // Validate that the config file exists
    const fs = require("fs");
    if (!fs.existsSync(configPath)) {
      console.error("⚠️  Error: Could not find plopfile.js");
      console.error("Please reinstall the package.");
      process.exit(1);
    }

    Plop.prepare(
      {
        cwd: projectDir,
        configPath: configPath,
        preload: argv.slice(1),
        completion: argv.includes("--completion"),
      },
      (env) => Plop.execute(env, run)
    );
  } catch (error) {
    console.error("⚠️  Error running rorg:", error.message);
    if (error.code === "MODULE_NOT_FOUND") {
      console.error("Please try reinstalling the package:");
      console.error("  npm install rorg");
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("⚠️  Unexpected error:", error.message);
  process.exit(1);
});
