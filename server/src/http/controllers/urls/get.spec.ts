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

	it('should redirect to the original URL', async () => {
		const createResponse = await request(app.server)
			.post('/urls')
			.send({
				originalUrl: 'https://www.example.com',
				shortUrl: 'example',
			})
			.expect(201)

		expect(createResponse.body.clickCount).toEqual(0)

		const getResponse = await request(app.server).get('/example').expect(302)

		expect(getResponse.headers.location).toEqual('https://www.example.com')
	})

	it('should return 404 when URL does not exist', async () => {
		const response = await request(app.server).get('/nonexistent').expect(404)

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

		const firstResponse = await request(app.server).get('/google').expect(302)

		expect(firstResponse.headers.location).toEqual('https://www.google.com')

		const secondResponse = await request(app.server).get('/google').expect(302)

		expect(secondResponse.headers.location).toEqual('https://www.google.com')
	})
})
