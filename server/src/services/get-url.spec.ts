import { InMemoryUrlsRepository } from '@/repositories/in-memory/in-memory-urls-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UrlNotFoundError } from './errors/url-not-found-error'
import { GetUrlService } from './get-url'

let urlsRepository: InMemoryUrlsRepository
let sut: GetUrlService

describe('Get URL Service', () => {
	beforeEach(() => {
		urlsRepository = new InMemoryUrlsRepository()
		sut = new GetUrlService(urlsRepository)
	})

	it('should be able to get a url', async () => {
		const createdUrl = await urlsRepository.create({
			originalUrl: 'http://example.com',
			shortUrl: 'http://short.com/example',
		})

		const { url } = await sut.execute({
			shortUrl: 'http://short.com/example',
		})

		expect(url.id).toEqual(createdUrl.id)
	})

	it('should not be able to get a non-existing url', async () => {
		await expect(
			sut.execute({
				shortUrl: 'http://short.com/non-existing',
			}),
		).rejects.toBeInstanceOf(UrlNotFoundError)
	})
})
