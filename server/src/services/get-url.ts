import type { Url } from '@/db/types'
import { env } from '@/env'
import type { UrlsRepository } from '@/repositories/urls-repository'
import { UrlNotFoundError } from './errors/url-not-found-error'

interface GetUrlServiceRequest {
	shortUrl: string
}

export class GetUrlService {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute({ shortUrl: slug }: GetUrlServiceRequest): Promise<Url> {
		const shortUrl = new URL(slug, env.BASE_SHORT_URL).toString()
		const url = await this.urlsRepository.findByShortUrl(shortUrl)

		if (!url) {
			throw new UrlNotFoundError()
		}

		await this.urlsRepository.incrementClickCount(shortUrl)

		const updatedUrl = await this.urlsRepository.findByShortUrl(shortUrl)
		if (!updatedUrl) {
			throw new UrlNotFoundError()
		}
		return updatedUrl
	}
}
