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
			shortUrl: 'google',
		})

		expect(response.statusCode).toBe(201)
		expect(response.body.shortUrl).toEqual('google')
	})

	it('should return 409 when shortUrl already exists', async () => {
		// Create first URL
		await request(app.server).post('/urls').send({
			originalUrl: 'https://example.com',
			shortUrl: 'duplicate-url',
		})

		// Try to create same shortUrl again
		const response = await request(app.server).post('/urls').send({
			originalUrl: 'https://different.com',
			shortUrl: 'duplicate-url',
		})

		expect(response.statusCode).toBe(409)
		expect(response.body).toEqual({
			message: 'Short URL already exists',
		})
	})

	it('should return 400 for invalid originalUrl', async () => {
		const response = await request(app.server).post('/urls').send({
			originalUrl: 'invalid-url',
			shortUrl: 'test-short-url',
		})

		expect(response.statusCode).toBe(400)
	})

	it('should return 400 for invalid shortUrl', async () => {
		const response = await request(app.server).post('/urls').send({
			originalUrl: 'https://valid.com',
			shortUrl: 'invalid short url',
		})

		expect(response.statusCode).toBe(400)
	})

	it('should persist URL data to database', async () => {
		const urlData = {
			originalUrl: 'https://persistence-test.com',
			shortUrl: 'persist-short-url',
		}

		const response = await request(app.server).post('/urls').send(urlData)

		expect(response.statusCode).toBe(201)

		// Verify the data matches what we sent, with slug converted to full URL
		expect(response.body.originalUrl).toBe(urlData.originalUrl)
		expect(response.body.shortUrl).toBe(urlData.shortUrl)
		expect(response.body.clickCount).toBe(0)
		expect(response.body.id).toBeDefined()
		expect(new Date(response.body.createdAt)).toBeInstanceOf(Date)
	})
})
