import type { NewUrl, Url } from '@/db/types'

export interface UrlsRepository {
	create(data: NewUrl): Promise<Url>
	findByShortUrl(shortUrl: string): Promise<Url | null>
	incrementClickCount(shortUrl: string): Promise<void>
}
