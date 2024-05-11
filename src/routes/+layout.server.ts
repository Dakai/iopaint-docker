import fs from 'fs';

export const models = JSON.parse(fs.readFileSync('static/models.json', 'utf8'));
