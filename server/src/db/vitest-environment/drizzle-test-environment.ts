import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

import { db } from '@/db'

function generateDatabaseURL(schema: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not defined')
	}

	const url = new URL(process.env.DATABASE_URL)

	url.searchParams.set('schema', schema)

	return url.toString()
}

export default (<Environment>{
	name: 'drizzle',
	transformMode: 'ssr',
	async setup() {
		const schema = randomUUID()

		const databaseURL = generateDatabaseURL(schema)

		process.env.DATABASE_URL = databaseURL

		execSync('npx drizzle-kit migrate')

		return {
			async teardown() {
				await db.execute(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
				await db.$client.end()
			},
		}
	},
})
