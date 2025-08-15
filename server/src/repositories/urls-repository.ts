import type { NewUrl, Url } from '@/db/types'
import type { Readable } from 'stream'

export interface UrlsRepository {
	create(data: NewUrl): Promise<Url>
	findByShortUrl(shortUrl: string): Promise<Url | null>
	findAll(): Promise<Url[]>
	incrementClickCount(shortUrl: string): Promise<void>
	delete(shortUrl: string): Promise<void>
	stream(): Promise<Readable>
}
