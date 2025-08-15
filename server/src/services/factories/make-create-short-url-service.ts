import { DrizzleUrlsRepository } from '@/repositories/drizzle/drizzle-urls-repository'
import { CreateShortUrlService } from '@/services/create-short-url'

export function makeCreateShortUrlService() {
	const urlsRepository = new DrizzleUrlsRepository()
	const createShortUrlService = new CreateShortUrlService(urlsRepository)

	return createShortUrlService
}
