import { DrizzleUrlsRepository } from '@/repositories/drizzle/drizzle-urls-repository'
import { ListUrlsService } from '@/services/list-urls'

export function makeListUrlsService() {
	const urlsRepository = new DrizzleUrlsRepository()
	const listUrlsService = new ListUrlsService(urlsRepository)

	return listUrlsService
}