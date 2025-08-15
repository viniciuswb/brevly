import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUrlsRepository } from '@/repositories/in-memory/in-memory-urls-repository'
import { DeleteShortUrlService } from './delete-short-url'
import { UrlNotFoundError } from './errors/url-not-found-error'

describe('DeleteShortUrlService', () => {
	let urlsRepository: InMemoryUrlsRepository
	let sut: DeleteShortUrlService

	beforeEach(() => {
		urlsRepository = new InMemoryUrlsRepository()
		sut = new DeleteShortUrlService(urlsRepository)
	})

	it('should be able to delete a short url', async () => {
		const slug = 'test-slug'
		const originalUrl = 'https://example.com'
		const shortUrl = `http://localhost:3333/${slug}`

		await urlsRepository.create({
			originalUrl,
			shortUrl,
		})

		await sut.execute({ slug })

		expect(urlsRepository.items).toHaveLength(0)
	})

	it('should not be able to delete a non-existing short url', async () => {
		const slug = 'test-slug'

		await expect(sut.execute({ slug })).rejects.toBeInstanceOf(UrlNotFoundError)
	})
})
