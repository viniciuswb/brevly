import { z } from 'zod'

import type { NewUrl, Url } from '@/db/types'
import type { UrlsRepository } from '@/repositories/urls-repository'

export class CreateShortUrl {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute({ originalUrl, shortUrl }: NewUrl): Promise<Url> {
		const urlSchema = z.object({
			originalUrl: z.string().url({ message: 'Invalid original URL format' }),
			shortUrl: z.string().url({ message: 'Invalid short URL format' }),
		})

		const { success } = urlSchema.safeParse({ originalUrl, shortUrl })
		if (!success) {
			throw new Error('Invalid URL format')
		}

		const existingUrl = await this.urlsRepository.findByShortUrl(shortUrl)
		if (existingUrl) {
			throw new Error(`Short URL '${shortUrl}' already exists`)
		}

		const url = await this.urlsRepository.create({ originalUrl, shortUrl })
		return url
	}
}
