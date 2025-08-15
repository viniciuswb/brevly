import { DrizzleUrlsRepository } from '@/repositories/drizzle/drizzle-urls-repository'
import { GetUrlService } from '@/services/get-url'

export function makeGetUrlService() {
	const urlsRepository = new DrizzleUrlsRepository()
	const getUrlService = new GetUrlService(urlsRepository)

	return getUrlService
}
