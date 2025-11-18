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
				const url = req.url || '';

				if (req.method === 'GET' && (url === '' || url === '/')) {
					await routes.handleGetFileList(req, res);
					return;
				}

				if (req.method === 'GET' && url.startsWith('/')) {
					const filename = url.substring(1);
					if (filename) {
						await routes.handleGetFile(req, res, filename);
						return;
					}
				}

				if (req.method === 'POST' && (url === '' || url === '/')) {
					await routes.handleSaveFile(req, res);
					return;
				}

				next();
			});
		}
	};
}
