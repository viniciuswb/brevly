import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { app } from '@/app'

describe('Export URLs to CSV (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should return 500 when Cloudflare credentials are missing', async () => {
		const response = await request(app.server)
			.post('/urls/export')
			.expect(500)

		expect(response.body).toEqual({
			message: 'Cloudflare R2 credentials are not configured',
		})
	})

	it('should have the export endpoint available', async () => {
		// Just check that the endpoint exists and returns a response
		const response = await request(app.server)
			.post('/urls/export')

		// Should return either 200 (if credentials configured) or 500 (if not configured)
		expect([200, 500]).toContain(response.status)
	})
})