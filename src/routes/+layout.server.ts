import fs from 'fs';

export const load = async () => {
	const models = JSON.parse(fs.readFileSync('static/models.json', 'utf8'));
	return { models: models };
};
