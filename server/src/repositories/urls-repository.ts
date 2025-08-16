import type { Readable } from 'node:stream'
import type { NewUrl, Url } from '@/db/types'

export interface UrlsRepository {
	create(data: NewUrl): Promise<Url>
	findByShortUrl(shortUrl: string): Promise<Url | null>
	findAll(): Promise<Url[]>
	stream(): Promise<Readable>
	incrementClickCount(shortUrl: string): Promise<void>
	delete(shortUrl: string): Promise<void>
}
