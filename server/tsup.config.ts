import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/**/*.ts'],
	outDir: 'dist',
	clean: true,
	format: 'esm',
})
