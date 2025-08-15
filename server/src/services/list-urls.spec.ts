import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUrlsRepository } from '@/repositories/in-memory/in-memory-urls-repository'
import { ListUrlsService } from './list-urls'

let urlsRepository: InMemoryUrlsRepository
let sut: ListUrlsService

describe('List URLs Service', () => {
	beforeEach(() => {
		urlsRepository = new InMemoryUrlsRepository()
		sut = new ListUrlsService(urlsRepository)
	})

	it('should return an empty array when no URLs exist', async () => {
		const urls = await sut.execute()

		expect(urls).toEqual([])
	})

	it('should return all URLs sorted by creation date', async () => {
		// Create some URLs
		await urlsRepository.create({
			originalUrl: 'https://www.example.com',
			shortUrl: 'http://localhost:3333/example',
		})

		await urlsRepository.create({
			originalUrl: 'https://www.google.com',
			shortUrl: 'http://localhost:3333/google',
		})

		const urls = await sut.execute()

		expect(urls).toHaveLength(2)
		expect(urls[0].originalUrl).toBe('https://www.example.com')
		expect(urls[1].originalUrl).toBe('https://www.google.com')
		expect(urls[0].createdAt.getTime()).toBeLessThanOrEqual(
			urls[1].createdAt.getTime()
		)
	})

	it('should include all URL properties', async () => {
		await urlsRepository.create({
			originalUrl: 'https://www.example.com',
			shortUrl: 'http://localhost:3333/example',
		})

		const urls = await sut.execute()

		expect(urls[0]).toEqual(
			expect.objectContaining({
				id: expect.any(String),
				originalUrl: 'https://www.example.com',
				shortUrl: 'http://localhost:3333/example',
				clickCount: 0,
				createdAt: expect.any(Date),
			})
		)
	})
})
