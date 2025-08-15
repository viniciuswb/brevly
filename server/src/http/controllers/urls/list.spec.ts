import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('List URLs (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should return an empty array when no URLs exist', async () => {
		const response = await request(app.server)
			.get('/urls')
			.expect(200)

		expect(response.body).toEqual([])
	})

	it('should return all created URLs', async () => {
		// Create some URLs first
		await request(app.server)
			.post('/urls')
			.send({
				originalUrl: 'https://www.example.com',
				shortUrl: 'example',
			})
			.expect(201)

		await request(app.server)
			.post('/urls')
			.send({
				originalUrl: 'https://www.google.com',
				shortUrl: 'google',
			})
			.expect(201)

		const response = await request(app.server)
			.get('/urls')
			.expect(200)

		expect(response.body).toHaveLength(2)
		expect(response.body[0]).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				originalUrl: 'https://www.example.com',
				shortUrl: expect.stringContaining('example'),
				clickCount: 0,
				createdAt: expect.any(String),
			})
		)
		expect(response.body[1]).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				originalUrl: 'https://www.google.com',
				shortUrl: expect.stringContaining('google'),
				clickCount: 0,
				createdAt: expect.any(String),
			})
		)
	})

	it('should return URLs sorted by creation date', async () => {
		const response = await request(app.server)
			.get('/urls')
			.expect(200)

		if (response.body.length > 1) {
			const firstCreatedAt = new Date(response.body[0].createdAt)
			const secondCreatedAt = new Date(response.body[1].createdAt)
			expect(firstCreatedAt.getTime()).toBeLessThanOrEqual(secondCreatedAt.getTime())
		}
	})

	it('should include click counts when URLs have been accessed', async () => {
		// Create a URL
		const createResponse = await request(app.server)
			.post('/urls')
			.send({
				originalUrl: 'https://www.test.com',
				shortUrl: 'test',
			})
			.expect(201)

		// Access the URL to increment click count
		await request(app.server)
			.get('/urls/test')
			.expect(302)

		// List URLs and check click count
		const listResponse = await request(app.server)
			.get('/urls')
			.expect(200)

		const testUrl = listResponse.body.find((url: any) => url.shortUrl.includes('test'))
		expect(testUrl).toBeDefined()
		expect(testUrl.clickCount).toBe(1)
	})
})