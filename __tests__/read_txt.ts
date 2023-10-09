import * as fs from 'fs';
import * as path from 'path';

const filePath = path.join(__dirname, 'tags.txt');

try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\r\n');

    console.log(lines[18]);
} catch (err) {
    console.error(`Failed to read file: ${filePath}`);
    console.error(err);
}
