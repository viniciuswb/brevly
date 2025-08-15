import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { stringify } from 'csv-stringify'
import { uuidv7 } from 'uuidv7'
import type { Url } from '@/db/types'
import { env } from '@/env'
import type { UrlsRepository } from '@/repositories/urls-repository'

export interface ExportUrlsCsvResponse {
	downloadUrl: string
	filename: string
}

export class ExportUrlsCsvService {
	private s3Client: S3Client | null = null

	constructor(private readonly urlsRepository: UrlsRepository) {
		// Only initialize S3 client if all required environment variables are present
		if (this.areCloudflareCredentialsPresent()) {
			this.s3Client = new S3Client({
				region: 'auto',
				endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
				credentials: {
					accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID as string,
					secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY as string,
				},
			})
		}
	}

	private areCloudflareCredentialsPresent(): boolean {
		return !!(
			env.CLOUDFLARE_ACCOUNT_ID &&
			env.CLOUDFLARE_ACCESS_KEY_ID &&
			env.CLOUDFLARE_SECRET_ACCESS_KEY &&
			env.CLOUDFLARE_BUCKET &&
			env.CLOUDFLARE_PUBLIC_URL
		)
	}

	async execute(): Promise<ExportUrlsCsvResponse> {
		if (!this.areCloudflareCredentialsPresent()) {
			throw new Error('Cloudflare R2 credentials are not configured')
		}

		if (!this.s3Client) {
			throw new Error('S3 client is not initialized')
		}

		// Generate unique filename
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
		const randomId = uuidv7().split('-')[0] // Use first part of UUID for brevity
		const filename = `urls-export-${timestamp}-${randomId}.csv`

		// Get all URLs from repository
		const urls = await this.urlsRepository.findAll()

		// Create CSV data stream
		const csvData = await this.generateCsvData(urls)

		// Upload to Cloudflare R2
		await this.uploadToR2(csvData, filename)

		// Generate download URL
		const downloadUrl = `${env.CLOUDFLARE_PUBLIC_URL}/${filename}`

		return {
			downloadUrl,
			filename,
		}
	}

	private async generateCsvData(urls: Url[]): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const chunks: Buffer[] = []

			// Create readable stream from URLs data
			const urlsStream = Readable.from(
				urls.map(url => ({
					id: url.id,
					originalUrl: url.originalUrl,
					shortUrl: url.shortUrl,
					clickCount: url.clickCount,
					createdAt: url.createdAt.toISOString(),
				}))
			)

			// Create CSV stringify transform
			const csvTransform = stringify({
				header: true,
				columns: {
					id: 'ID',
					originalUrl: 'Original URL',
					shortUrl: 'Short URL',
					clickCount: 'Click Count',
					createdAt: 'Created At',
				},
			})

			// Collect chunks
			const collectTransform = new Transform({
				transform(chunk, _encoding, callback) {
					chunks.push(chunk)
					callback()
				},
			})

			// Process the stream
			pipeline(urlsStream, csvTransform, collectTransform)
				.then(() => {
					resolve(Buffer.concat(chunks))
				})
				.catch(reject)
		})
	}

	private async uploadToR2(data: Buffer, filename: string): Promise<void> {
		if (!this.s3Client) {
			throw new Error('S3 client is not initialized')
		}

		const command = new PutObjectCommand({
			Bucket: env.CLOUDFLARE_BUCKET as string,
			Key: filename,
			Body: data,
			ContentType: 'text/csv',
			ContentDisposition: `attachment; filename="${filename}"`,
		})

		await this.s3Client.send(command)
	}
}
