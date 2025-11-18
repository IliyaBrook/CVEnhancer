import {defineConfig, loadEnv} from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {createJsonApiPlugin, proxy} from './viteServer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({mode}) => {
	const env = loadEnv(mode, process.cwd(), '')
	const port = env.APP_PORT ? Number(env.APP_PORT) : 3000
	
	return {
		plugins: [
			react(),
			tsconfigPaths(),
			createJsonApiPlugin(__dirname)
		],
		server: {port, proxy},
		optimizeDeps: {
			include: ['pdfjs-dist'],
		},
	}
});