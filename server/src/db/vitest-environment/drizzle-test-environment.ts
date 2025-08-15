import 'dotenv/config'
import { execSync } from 'node:child_process'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { uuidv7 } from 'uuidv7'
import type { Environment } from 'vitest/environments'

function generateTestDatabaseURL(schemaName: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not defined')
	}

	const url = new URL(process.env.DATABASE_URL)

	// Create a unique database name for this test run
	const originalPath = url.pathname
	const dbName = originalPath.slice(1) // Remove leading slash
	url.pathname = `/${dbName}_test_${schemaName}`

	return url.toString()
}

export default (<Environment>{
	name: 'drizzle',
	transformMode: 'ssr',
	async setup() {
		const schemaName = uuidv7().replace(/-/g, '_') // Replace hyphens for valid schema names
		const testDatabaseURL = generateTestDatabaseURL(schemaName)

		// Create isolated test database
		const mainDatabaseURL = process.env.DATABASE_URL
		if (!mainDatabaseURL) {
			throw new Error('DATABASE_URL is not defined')
		}

		const mainPg = postgres(mainDatabaseURL)
		const mainDb = drizzle(mainPg)

		try {
			// Create test database
			await mainDb.execute(
				`CREATE DATABASE ${JSON.stringify(`brevly_test_${schemaName}`)}`
			)
		} catch {
			// Database might already exist, that's ok
		}

		await mainPg.end()

		// Set environment for migrations
		process.env.DATABASE_URL = testDatabaseURL

		// Run migrations on test database
		execSync('npx drizzle-kit migrate', { stdio: 'inherit' })

		return {
			async teardown() {
				// Connect to main database to drop test database
				const originalDatabaseURL = process.env.DATABASE_URL?.replace(
					`_test_${schemaName}`,
					''
				)
				if (!originalDatabaseURL) {
					console.warn('Could not determine original database URL for cleanup')
					return
				}

				const cleanupPg = postgres(originalDatabaseURL)
				const cleanupDb = drizzle(cleanupPg)

				try {
					// Terminate all connections to the test database first
					await cleanupDb.execute(`
						SELECT pg_terminate_backend(pid)
						FROM pg_stat_activity
						WHERE datname = '${`brevly_test_${schemaName}`}'
						AND pid <> pg_backend_pid()
					`)

					// Small delay to ensure connections are terminated
					await new Promise(resolve => setTimeout(resolve, 100))

					// Now drop the database
					await cleanupDb.execute(
						`DROP DATABASE IF EXISTS ${JSON.stringify(`brevly_test_${schemaName}`)}`
					)
				} catch (error) {
					console.warn('Failed to cleanup test database:', error)
				}

				await cleanupPg.end()
			},
		}
	},
})
