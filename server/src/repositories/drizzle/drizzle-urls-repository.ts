import { asc, eq, sql } from 'drizzle-orm'
import { uuidv7 } from 'uuidv7'

import { db } from '@/db'
import { schema } from '@/db/schemas'
import type { NewUrl, Url } from '@/db/types'
import type { UrlsRepository } from '../urls-repository'

export class DrizzleUrlsRepository implements UrlsRepository {
	async create(data: NewUrl): Promise<Url> {
		const url = {
			id: uuidv7(),
			originalUrl: data.originalUrl,
			shortUrl: data.shortUrl,
			clickCount: 0,
			createdAt: new Date(),
		} as Url

		// Assuming you have a Drizzle ORM instance to handle the database operations
		await db.insert(schema.urls).values(url)
		return url
	}

	async findByShortUrl(shortUrl: string): Promise<Url | null> {
		const url = await db
			.select({
				id: schema.urls.id,
				originalUrl: schema.urls.originalUrl,
				shortUrl: schema.urls.shortUrl,
				clickCount: schema.urls.clickCount,
				createdAt: schema.urls.createdAt,
			})
			.from(schema.urls)
			.where(eq(schema.urls.shortUrl, shortUrl))
			.limit(1)

		return url[0] || null
	}

	async findAll(): Promise<Url[]> {
		const urls = await db
			.select({
				id: schema.urls.id,
				originalUrl: schema.urls.originalUrl,
				shortUrl: schema.urls.shortUrl,
				clickCount: schema.urls.clickCount,
				createdAt: schema.urls.createdAt,
			})
			.from(schema.urls)
			.orderBy(asc(schema.urls.createdAt))

		return urls
	}

	async incrementClickCount(shortUrl: string): Promise<void> {
		await db
			.update(schema.urls)
			.set({ clickCount: sql`${schema.urls.clickCount} + 1` })
			.where(eq(schema.urls.shortUrl, shortUrl))
	}
}
