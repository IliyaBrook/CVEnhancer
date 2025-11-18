import {UserConfig} from 'vite';

type TProxy = NonNullable<UserConfig['server']>['proxy']

export const proxy: TProxy = {
	'/api/anthropic': {
		target: 'https://api.anthropic.com',
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/api\/anthropic/, ''),
		secure: true,
	},
	'/api/openai': {
		target: 'https://api.openai.com',
		changeOrigin: true,
		rewrite: (path: string) => path.replace(/^\/api\/openai/, ''),
		secure: true,
	},
}