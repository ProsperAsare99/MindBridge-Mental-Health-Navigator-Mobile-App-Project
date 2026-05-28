const fs = require('fs');
const file = 'mindbridge-mobile/src/utils/translations.ts';
let content = fs.readFileSync(file, 'utf8');

const schemaAdd = `
    journey: {
      title: string;
      subtitle: string;
      streak: string;
      points: string;
      done: string;
      progress_label: string;
      daily_plan: string;
    };`;
content = content.replace(/export interface TranslationSchema \{/, `export interface TranslationSchema {\n${schemaAdd}`);

const langs = ['English', 'French', 'Twi', 'Ga', 'Ewe', 'Hausa'];
for (const lang of langs) {
    const vals = `
    journey: {
      title: 'My Journey',
      subtitle: 'Today',
      streak: 'Streak',
      points: 'Points',
      done: 'Done',
      progress_label: 'Completed',
      daily_plan: 'Daily Plan',
    },`;
    const regex = new RegExp(`(${lang}: \\{)`);
    content = content.replace(regex, `$1\n${vals}`);
}
fs.writeFileSync(file, content);
console.log('Journey translations patched successfully!');
