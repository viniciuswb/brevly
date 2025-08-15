import { uuidv7 } from 'uuidv7'

import type { NewUrl, Url } from '@/db/types'
import type { UrlsRepository } from '../urls-repository'

export class InMemoryUrlsRepository implements UrlsRepository {
	public items: Url[] = []

	async create(data: NewUrl): Promise<Url> {
		const url = {
			id: uuidv7(),
			originalUrl: data.originalUrl,
			shortUrl: data.shortUrl,
			clickCount: 0,
			createdAt: new Date(),
		} as Url

		this.items.push(url)
		return url
	}

	async findByShortUrl(shortUrl: string): Promise<Url | null> {
		const url = this.items.find(item => item.shortUrl === shortUrl)
		return url || null
	}

	async findAll(): Promise<Url[]> {
		return [...this.items].sort(
			(a, b) => a.createdAt.getTime() - b.createdAt.getTime()
		)
	}

	async incrementClickCount(shortUrl: string): Promise<void> {
		const url = this.items.find(item => item.shortUrl === shortUrl)
		if (url) {
			url.clickCount += 1
		}
	}
}
