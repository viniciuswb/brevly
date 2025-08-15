import type { Url } from '@/db/types'
import type { UrlsRepository } from '@/repositories/urls-repository'

export class ListUrlsService {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute(): Promise<Url[]> {
		const urls = await this.urlsRepository.findAll()
		return urls
	}
}
