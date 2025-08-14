import { DrizzleUrlsRepository } from '@/repositories/drizzle/drizzle-urls-repository'
import { GetUrlService } from '../get-url'

export function makeGetUrlService() {
	const urlsRepository = new DrizzleUrlsRepository()
	const service = new GetUrlService(urlsRepository)

	return service
}
