import type { Readable } from 'node:stream'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryUrlsRepository } from '@/repositories/in-memory/in-memory-urls-repository'
import { ExportUrlsService } from './export-urls'

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

describe('ExportUrlsService', () => {
	let urlsRepository: InMemoryUrlsRepository
	let sut: ExportUrlsService

	beforeEach(() => {
		urlsRepository = new InMemoryUrlsRepository()
		sut = new ExportUrlsService(urlsRepository)
	})

	it('should be able to export urls to a csv file', async () => {
		await urlsRepository.create({
			originalUrl: 'https://example.com',
			shortUrl: 'custom',
		})

		const { url } = await sut.execute()

		expect(url).toEqual('https://example.com/export.csv')
	})
})
