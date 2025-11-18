import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export interface JsonFileInfo {
	name: string;
	displayName: string;
}

export class JsonFileService {
	constructor(private jsonDir: string) {}

	async getFileList(): Promise<JsonFileInfo[]> {
		const files = await readdir(this.jsonDir);
		return files
			.filter(file => file.endsWith('.json'))
			.map(file => ({
				name: file,
				displayName: file.replace('.json', '')
			}));
	}

	async getFileContent(filename: string): Promise<any> {
		const filePath = join(this.jsonDir, filename);
		const content = await readFile(filePath, 'utf-8');
		return JSON.parse(content);
	}

	async saveFile(filename: string, data: any): Promise<string> {
		const fullFilename = filename.endsWith('.json') ? filename : `${filename}.json`;
		const filePath = join(this.jsonDir, fullFilename);
		const jsonContent = JSON.stringify(data, null, 2);

		await writeFile(filePath, jsonContent, 'utf-8');

		return fullFilename;
	}
}
