import { Plugin } from 'vite';
import { join } from 'path';
import { JsonFileService } from './services/jsonFileService';
import { JsonFilesRoutes } from './routes/jsonFilesRoutes';

export function createJsonApiPlugin(rootDir: string): Plugin {
	return {
		name: 'json-api',
		configureServer(server) {
			const JSON_DIR = join(rootDir, 'src/json_cv_data/json_files');
			const service = new JsonFileService(JSON_DIR);
			const routes = new JsonFilesRoutes(service);

			server.middlewares.use('/api/json-files', async (req, res, next) => {
				if (req.method === 'GET' && req.url === '/api/json-files') {
					await routes.handleGetFileList(req, res);
					return;
				}

				if (req.method === 'GET' && req.url?.startsWith('/api/json-files/')) {
					const filename = req.url.replace('/api/json-files/', '');
					await routes.handleGetFile(req, res, filename);
					return;
				}

				if (req.method === 'POST' && req.url === '/api/json-files') {
					await routes.handleSaveFile(req, res);
					return;
				}

				next();
			});
		}
	};
}
