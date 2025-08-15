import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'

describe('Delete a shortUrl (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to delete a shortUrl', async () => {
		const slug = 'test-delete'
		await request(app.server).post('/urls').send({
			originalUrl: 'https://example.com',
			shortUrl: slug,
		})

		const response = await request(app.server).delete(`/urls/${slug}`)

		expect(response.statusCode).toBe(204)
	})

	it('should return 404 when trying to delete a non-existing shortUrl', async () => {
		const slug = 'non-existing-slug'
		const response = await request(app.server).delete(`/urls/${slug}`)

		expect(response.statusCode).toBe(404)
		expect(response.body).toEqual({
			message: 'URL not found',
		})
	})

	it('should not be able to get a deleted shortUrl', async () => {
		const slug = 'test-get-deleted'
		await request(app.server).post('/urls').send({
			originalUrl: 'https://example.com',
			shortUrl: slug,
		})

		await request(app.server).delete(`/urls/${slug}`)

		const response = await request(app.server).get(`/urls/${slug}`)

		expect(response.statusCode).toBe(404)
	})
})
