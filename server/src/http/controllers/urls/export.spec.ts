import type { Readable } from 'node:stream'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { app } from '@/app'

vi.mock('@/lib/r2', () => {
	return {
		uploadToR2: vi.fn(
			async (stream: Readable, _filename: string, _contentType: string) => {
				for await (const _chunk of stream) {
					// do nothing
				}
				return Promise.resolve({ url: 'https://example.com/export.csv' })
			}
		),
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
