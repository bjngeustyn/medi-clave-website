const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const files = ['index.html', 'styles.css', 'app.js', '.nojekyll'];
const directories = ['vendor'];

fs.mkdirSync(dist, { recursive: true });

for (const entry of fs.readdirSync(dist)) {
  fs.rmSync(path.join(dist, entry), { recursive: true, force: true });
}

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

for (const directory of directories) {
  fs.cpSync(path.join(root, directory), path.join(dist, directory), { recursive: true });
}

console.log(`Built Medi-Clave static site in ${dist}`);
