import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUrlsRepository } from '@/repositories/in-memory/in-memory-urls-repository'
import { UrlNotFoundError } from './errors/url-not-found-error'
import { GetUrlService } from './get-url'

let urlsRepository: InMemoryUrlsRepository
let sut: GetUrlService

describe('getUrl', () => {
	beforeEach(() => {
		urlsRepository = new InMemoryUrlsRepository()
		sut = new GetUrlService(urlsRepository)
	})

	it('should get a URL and increment click count', async () => {
		await urlsRepository.create({
			originalUrl: 'https://www.example.com',
			shortUrl: 'http://localhost:3333/example',
		})

		const url = await sut.execute({
			shortUrl: 'example',
		})

		expect(url.id).toEqual(expect.any(String))
		expect(url.originalUrl).toEqual('https://www.example.com')
		expect(url.shortUrl).toEqual('http://localhost:3333/example')
		expect(url.clickCount).toEqual(1)
		expect(url.createdAt).toEqual(expect.any(Date))

		const updatedUrl = await urlsRepository.findByShortUrl(
			'http://localhost:3333/example'
		)
		expect(updatedUrl?.clickCount).toEqual(1)
	})

	it('should throw error when URL does not exist', async () => {
		await expect(() =>
			sut.execute({
				shortUrl: 'nonexistent',
			})
		).rejects.toBeInstanceOf(UrlNotFoundError)
	})

	it('should increment click count on multiple accesses', async () => {
		await urlsRepository.create({
			originalUrl: 'https://www.example.com',
			shortUrl: 'http://localhost:3333/example',
		})

		const firstAccess = await sut.execute({
			shortUrl: 'example',
		})
		expect(firstAccess.clickCount).toEqual(1)

		const secondAccess = await sut.execute({
			shortUrl: 'example',
		})
		expect(secondAccess.clickCount).toEqual(2)

		const updatedUrl = await urlsRepository.findByShortUrl(
			'http://localhost:3333/example'
		)
		expect(updatedUrl?.clickCount).toEqual(2)
	})
})
