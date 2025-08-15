import { DrizzleUrlsRepository } from '@/repositories/drizzle/drizzle-urls-repository'
import { ExportUrlsCsvService } from '@/services/export-urls-csv'

export function makeExportUrlsCsvService() {
	const urlsRepository = new DrizzleUrlsRepository()
	const exportUrlsCsvService = new ExportUrlsCsvService(urlsRepository)

	return exportUrlsCsvService
}
