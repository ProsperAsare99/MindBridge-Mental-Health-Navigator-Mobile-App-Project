const fs = require('fs');
const file = 'mindbridge-mobile/src/utils/translations.ts';
let content = fs.readFileSync(file, 'utf8');

// Replace today: 'Overview' with today: 'Home' for English
content = content.replace(/today:\s*'Overview'/, "today: 'Home'");

fs.writeFileSync(file, content);
console.log('Home translation patched successfully!');
