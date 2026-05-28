const fs = require('fs');
const file = 'mindbridge-mobile/src/utils/translations.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace today: 'Today' with today: 'Overview' for English
content = content.replace(/today:\s*'Today'/, "today: 'Overview'");

fs.writeFileSync(file, content);
console.log('Overview translations patched successfully!');
