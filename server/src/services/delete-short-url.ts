import type { UrlsRepository } from '@/repositories/urls-repository'
import { UrlNotFoundError } from './errors/url-not-found-error'

interface DeleteShortUrlServiceRequest {
	slug: string
}

export class DeleteShortUrlService {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute({ slug }: DeleteShortUrlServiceRequest): Promise<void> {
		const existingUrl = await this.urlsRepository.findByShortUrl(slug)
		if (!existingUrl) {
			throw new UrlNotFoundError()
		}

		await this.urlsRepository.delete(slug)
	}
}
