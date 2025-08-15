import { env } from '@/env'
import type { UrlsRepository } from '@/repositories/urls-repository'
import { UrlNotFoundError } from './errors/url-not-found-error'

interface DeleteShortUrlServiceRequest {
	slug: string
}

export class DeleteShortUrlService {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute({ slug }: DeleteShortUrlServiceRequest): Promise<void> {
		const shortUrl = new URL(slug, env.BASE_SHORT_URL).toString()

		const existingUrl = await this.urlsRepository.findByShortUrl(shortUrl)
		if (!existingUrl) {
			throw new UrlNotFoundError()
		}

		await this.urlsRepository.delete(shortUrl)
	}
}
