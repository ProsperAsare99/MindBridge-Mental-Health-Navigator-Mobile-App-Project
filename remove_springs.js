const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    } else if (file.endsWith('.tsx')) {
      filelist.push(dir + '/' + file);
    }
  });
  return filelist;
};

const appDir = path.join(__dirname, 'mindbridge-mobile', 'app');
const files = walkSync(appDir);

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const newContent = content
    .replace(/\.springify\(\)\.damping\(\d+\)/g, '.duration(500)')
    .replace(/\.springify\(\)/g, '.duration(500)');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
