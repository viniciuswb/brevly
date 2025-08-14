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
					include: ['**/*.spec.ts'],
					exclude: ['**/http/**'],
				},
			},
			{
				extends: true,
				test: {
					name: 'e2e',
					include: ['**/*.spec.ts'],
					exclude: ['**/services/**'],
					environment:
						'./src/db/vitest-environment/drizzle-test-environment.ts',
				},
			},
		],
		coverage: {
			exclude: ['build/**', 'coverage/**', 'node_modules/**'],
		},
	},
})
