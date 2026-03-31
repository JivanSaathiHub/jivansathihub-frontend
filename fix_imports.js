const fs = require("fs");
const path = require("path");

const dir = path.join(process.cwd(), "src", "pages", "user");
const files = fs.readdirSync(dir).filter(f => f.match(/\.[jt]sx?$/));

files.forEach(file => {
  const fp = path.join(dir, file);
  let c = fs.readFileSync(fp, "utf8");
  let changed = false;

  // Fix mismatched quotes: '../../anything" -> "../../anything"
  // and also handle any remaining ../  single-level paths
  const fixed = c
    // Fix mismatched quote imports: '../../...something"  -> "../../...something"
    .replace(/'(\.\.\/\.\.\/[^"']+)"/g, '"$1"')
    // Fix mismatched quote imports: "../../...something'  -> "../../...something"
    .replace(/"(\.\.\/\.\.\/[^"']+)'/g, '"$1"')
    // Fix any still-single-level ../ imports -> ../../
    .replace(/from "(\.\.\/(?!\.\.\/)[^"]+)"/g, (match, p1) => `from "../../${p1.slice(3)}"`)
    .replace(/from '(\.\.\/(?!\.\.\/)[^']+)'/g, (match, p1) => `from "../../${p1.slice(3)}"`)
    // Fix mismatched after above fixes
    .replace(/'(\.\.\/\.\.\/[^"']+)"/g, '"$1"')
    .replace(/"(\.\.\/\.\.\/[^"']+)'/g, '"$1"');

  if (fixed !== c) {
    fs.writeFileSync(fp, fixed, "utf8");
    changed = true;
    console.log("Fixed:   " + file);
  } else {
    console.log("OK:      " + file);
  }
});

console.log("\nDone! Run: npm start");