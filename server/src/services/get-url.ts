import type { Url } from '@/db/types'
import type { UrlsRepository } from '@/repositories/urls-repository'
import { UrlNotFoundError } from './errors/url-not-found-error'

interface GetUrlServiceRequest {
	shortUrl: string
}

export class GetUrlService {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute({ shortUrl: slug }: GetUrlServiceRequest): Promise<Url> {
		const url = await this.urlsRepository.findByShortUrl(slug)

		if (!url) {
			throw new UrlNotFoundError()
		}

		await this.urlsRepository.incrementClickCount(slug)

		const updatedUrl = await this.urlsRepository.findByShortUrl(slug)
		if (!updatedUrl) {
			throw new UrlNotFoundError()
		}
		return updatedUrl
	}
}
