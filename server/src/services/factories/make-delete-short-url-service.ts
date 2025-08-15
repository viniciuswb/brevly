import { DrizzleUrlsRepository } from '@/repositories/drizzle/drizzle-urls-repository'
import { DeleteShortUrlService } from '@/services/delete-short-url'

export function makeDeleteShortUrlService() {
	const urlsRepository = new DrizzleUrlsRepository()
	const deleteShortUrlService = new DeleteShortUrlService(urlsRepository)

	return deleteShortUrlService
}
