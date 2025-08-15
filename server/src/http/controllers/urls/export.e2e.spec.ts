import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { Readable } from 'stream'

vi.mock('@/lib/r2', () => {
	return {
		uploadToR2: vi.fn(async (stream: Readable, filename: string, contentType: string) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (const chunk of stream) {
				// do nothing
			}
			return Promise.resolve({ url: 'https://example.com/export.csv' })
		}),
	}
})

describe('Export URLs (e2e)', () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it('should be able to export urls', async () => {
		// Create a url first to have some data to export
		await request(app.server).post('/urls').send({
			originalUrl: 'https://example.com',
			shortUrl: 'custom-link-for-export',
		})

		const response = await request(app.server).get('/urls/export').send()

		expect(response.statusCode).toEqual(201)
		expect(response.body).toEqual({
			url: 'https://example.com/export.csv',
		})
	})
})
