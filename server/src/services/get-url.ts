import type { Url } from '@/db/types'
import type { UrlsRepository } from '@/repositories/urls-repository'
import { UrlNotFoundError } from './errors/url-not-found-error'

interface GetUrlServiceRequest {
	shortUrl: string
}

interface GetUrlServiceResponse {
	url: Url
}

export class GetUrlService {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute({
		shortUrl,
	}: GetUrlServiceRequest): Promise<GetUrlServiceResponse> {
		const url = await this.urlsRepository.findByShortUrl(shortUrl)

		if (!url) {
			throw new UrlNotFoundError()
		}

		return { url }
	}
}
