import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Get URL (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to get a URL', async () => {
		const createResponse = await request(app.server)
			.post('/urls')
			.send({
				originalUrl: 'https://www.example.com',
				shortUrl: 'example',
			})
			.expect(201)

		expect(createResponse.body.clickCount).toEqual(0)

		const getResponse = await request(app.server)
			.get('/urls/example')
			.expect(200)

		expect(getResponse.body).toEqual({
			id: expect.any(String),
			originalUrl: 'https://www.example.com',
			shortUrl: expect.stringContaining('/example'),
			clickCount: 1,
			createdAt: expect.any(String),
		})
	})

	it('should return 404 when URL does not exist', async () => {
		const response = await request(app.server)
			.get('/urls/nonexistent')
			.expect(404)

		expect(response.body).toEqual({
			message: 'URL not found',
		})
	})

	it('should increment click count on multiple accesses', async () => {
		await request(app.server)
			.post('/urls')
			.send({
				originalUrl: 'https://www.google.com',
				shortUrl: 'google',
			})
			.expect(201)

		const firstResponse = await request(app.server)
			.get('/urls/google')
			.expect(200)

		expect(firstResponse.body.clickCount).toEqual(1)

		const secondResponse = await request(app.server)
			.get('/urls/google')
			.expect(200)

		expect(secondResponse.body.clickCount).toEqual(2)
	})
})
