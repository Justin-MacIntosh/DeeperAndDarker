const fs = require("fs");
const path = require("path");

module.exports = async function (context) {
  const appOutDir = context.appOutDir;

  // Remove all locales except en-US
  const localeDir = path.join(appOutDir, "locales");
  if (fs.existsSync(localeDir)) {
    fs.readdirSync(localeDir).forEach(file => {
      if (!file.startsWith("en-US")) {
        fs.rmSync(path.join(localeDir, file), { recursive: true, force: true });
      }
    });
  }
};
