import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		dir: 'src',
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					dir: 'src/services',
				},
			},
			// {
			// 	extends: true,
			// 	test: {
			// 		name: 'e2e',
			// 		dir: 'src/http',
			// 		environment:
			// 			'./prisma/vitest-environment-prisma/prisma-test-environment.ts',
			// 	},
			// },
		],
		coverage: {
			exclude: ['build/**', 'coverage/**', 'node_modules/**'],
		},
	},
})
