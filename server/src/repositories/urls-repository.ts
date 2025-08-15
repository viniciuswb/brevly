import type { NewUrl, Url } from '@/db/types'

export interface UrlsRepository {
	create(data: NewUrl): Promise<Url>
	findByShortUrl(shortUrl: string): Promise<Url | null>
	findAll(): Promise<Url[]>
	incrementClickCount(shortUrl: string): Promise<void>
}
