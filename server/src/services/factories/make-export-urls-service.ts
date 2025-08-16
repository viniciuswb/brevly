import { DrizzleUrlsRepository } from '@/repositories/drizzle/drizzle-urls-repository'
import { ExportUrlsService } from '../export-urls'

export function makeExportUrlsService() {
	const urlsRepository = new DrizzleUrlsRepository()
	const service = new ExportUrlsService(urlsRepository)

	return service
}
