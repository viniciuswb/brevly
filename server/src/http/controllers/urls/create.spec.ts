import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Create a shortUrl (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to create a shortUrl', async () => {
		const response = await request(app.server).post('/urls').send({
			originalUrl: 'https://google.com',
			shortUrl: 'http://localhost:3333/google',
		})

		expect(response.statusCode).toBe(201)
		expect(response.body).toEqual({
			id: expect.any(String),
			shortUrl: expect.any(String),
			originalUrl: expect.any(String),
		})
	})
})
