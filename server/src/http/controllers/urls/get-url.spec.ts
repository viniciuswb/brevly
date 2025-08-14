import { app } from '@/app'
import { db } from '@/db'
import { urls } from '@/db/schemas'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get URL (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get a url', async () => {
		await db.insert(urls).values({
			originalUrl: 'http://example.com',
			shortUrl: 'http://short.com/example',
		})

		const response = await app.inject({
			method: 'GET',
			url: `/r/${encodeURIComponent('http://short.com/example')}`,
		})

		expect(response.statusCode).toBe(301)
		expect(response.headers.location).toBe('http://example.com')
	})

	it('should not be able to get a non-existing url', async () => {
		const response = await app.inject({
			method: 'GET',
			url: `/r/${encodeURIComponent('http://short.com/non-existing')}`,
		})

		expect(response.statusCode).toBe(404)
	})
})
