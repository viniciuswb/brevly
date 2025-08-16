import { randomUUID } from 'node:crypto'
import { stringify } from 'csv-stringify'

import { uploadToR2 } from '@/lib/r2'
import type { UrlsRepository } from '@/repositories/urls-repository'

export class ExportUrlsService {
	constructor(private urlsRepository: UrlsRepository) {}

	async execute() {
		const dbStream = await this.urlsRepository.stream()

		const csvStream = stringify({
			header: true,
			columns: [
				{ key: 'id', header: 'UUID' },
				{ key: 'originalUrl', header: 'original URL' },
				{ key: 'shortUrl', header: 'shortened URL' },
				{ key: 'clickCount', header: 'access count' },
				{ key: 'createdAt', header: 'creation date' },
			],
		})

		const stream = dbStream.pipe(csvStream)
		const filename = `export-${Date.now()}-${randomUUID().slice(0, 5)}.csv`

		const { url } = await uploadToR2(stream, filename, 'text/csv')

		return { url }
	}
}
