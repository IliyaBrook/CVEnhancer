import {IncomingMessage, ServerResponse} from 'http';
import {JsonFileService} from '../services/jsonFileService';

export class JsonFilesRoutes {
	constructor(private service: JsonFileService) {
	}
	
	async handleGetFileList(_req: IncomingMessage, res: ServerResponse): Promise<void> {
		try {
			const files = await this.service.getFileList();
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(files));
		} catch (error) {
			console.error('Error reading JSON files:', error);
			res.statusCode = 500;
			res.end(JSON.stringify({error: 'Failed to read JSON files'}));
		}
	}
	
	async handleGetFile(_req: IncomingMessage, res: ServerResponse, filename: string): Promise<void> {
		try {
			const data = await this.service.getFileContent(filename);
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(data));
		} catch (error) {
			console.error('Error reading JSON file:', error);
			res.statusCode = 500;
			res.end(JSON.stringify({error: 'Failed to read JSON file'}));
		}
	}
	
	async handleSaveFile(req: IncomingMessage, res: ServerResponse): Promise<void> {
		let body = '';
		
		req.on('data', chunk => (body += chunk.toString()));
		req.on('end', async () => {
			try {
				const {filename, data} = JSON.parse(body);
				
				if (!filename) {
					res.statusCode = 400;
					res.end(JSON.stringify({error: 'Filename is required'}));
					return;
				}
				
				if (!data) {
					res.statusCode = 400;
					res.end(JSON.stringify({error: 'Data is required'}));
					return;
				}
				
				const savedFilename = await this.service.saveFile(filename, data);
				
				res.setHeader('Content-Type', 'application/json');
				res.end(
					JSON.stringify({
						success: true,
						filename: savedFilename,
						message: 'File saved successfully'
					})
				);
			} catch (error) {
				console.error('Error saving JSON file:', error);
				res.statusCode = 500;
				res.end(JSON.stringify({error: 'Failed to save JSON file'}));
			}
		});
	}
}
