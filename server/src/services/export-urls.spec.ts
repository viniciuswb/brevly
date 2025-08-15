import { InMemoryUrlsRepository } from '@/repositories/in-memory/in-memory-urls-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ExportUrlsService } from './export-urls'
import { Readable } from 'stream'

vi.mock('@/lib/r2', () => {
	return {
		uploadToR2: vi.fn(async (stream: Readable, filename: string, contentType: string) => {
			// consume the stream
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			for await (const chunk of stream) {
				// do nothing
			}
			return Promise.resolve({ url: 'https://example.com/export.csv' })
		}),
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
