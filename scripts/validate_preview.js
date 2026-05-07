const { existsSync, readFileSync } = require('node:fs');

const requiredFiles = ['index.html', 'styles.css', 'app.js'];
const requiredMarkup = [
  'id="file-input"',
  'id="drop-zone"',
  'id="source-language"',
  'id="target-language"',
  'id="file-list"',
  'id="supported-formats"',
  'From web preview to desktop EXE',
];

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    console.error(`Missing required file: ${file}`);
    process.exit(1);
  }
}

const html = readFileSync('index.html', 'utf8');

for (const marker of requiredMarkup) {
  if (!html.includes(marker)) {
    console.error(`Missing required markup: ${marker}`);
    process.exit(1);
  }
}

if (!html.includes('<link rel="stylesheet" href="styles.css" />')) {
  console.error('index.html does not link styles.css');
  process.exit(1);
}

if (!html.includes('<script src="app.js"></script>')) {
  console.error('index.html does not load app.js');
  process.exit(1);
}

console.log('Preview files validated successfully');
