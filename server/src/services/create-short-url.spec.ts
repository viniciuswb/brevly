import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUrlsRepository } from '@/repositories/in-memory/in-memory-urls-repository'
import { CreateShortUrlService } from './create-short-url'

describe('createShortUrl', () => {
	let urlsRepository: InMemoryUrlsRepository
	let sut: CreateShortUrlService

	beforeEach(() => {
		urlsRepository = new InMemoryUrlsRepository()
		sut = new CreateShortUrlService(urlsRepository)
	})

	it('should create a short URL', async () => {
		const { shortUrl, originalUrl } = await sut.execute({
			originalUrl: 'https://google.com',
			shortUrl: 'http://localhost:3333/google',
		})

		expect(shortUrl).toEqual('http://localhost:3333/google')
		expect(originalUrl).toEqual('https://google.com')
	})

	it('should throw error when shortened URL format is invalid', async () => {
		await expect(
			sut.execute({
				originalUrl: 'https://google.com',
				shortUrl: 'invalid-url',
			})
		).rejects.toThrow()
	})

	it('should throw error when original URL format is invalid', async () => {
		await expect(
			sut.execute({
				originalUrl: 'invalid-url',
				shortUrl: 'http://localhost:3333/google',
			})
		).rejects.toThrow()
	})

	it('should throw error when shortened URL already exists', async () => {
		// First creation should succeed
		await sut.execute({
			originalUrl: 'https://google.com',
			shortUrl: 'http://localhost:3333/existing',
		})

		// Second creation with same shortUrl should fail
		await expect(
			sut.execute({
				originalUrl: 'https://different.com',
				shortUrl: 'http://localhost:3333/existing',
			})
		).rejects.toThrow()
	})
})
