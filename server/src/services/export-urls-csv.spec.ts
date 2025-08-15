import { beforeEach, describe, expect, it, vi } from 'vitest'

import { InMemoryUrlsRepository } from '@/repositories/in-memory/in-memory-urls-repository'

// Mock all external dependencies
vi.mock('@aws-sdk/client-s3')
vi.mock('@/env', () => ({
	env: {
		CLOUDFLARE_ACCOUNT_ID: 'test-account-id',
		CLOUDFLARE_ACCESS_KEY_ID: 'test-access-key',
		CLOUDFLARE_SECRET_ACCESS_KEY: 'test-secret-key',
		CLOUDFLARE_BUCKET: 'test-bucket',
		CLOUDFLARE_PUBLIC_URL: 'https://cdn.example.com',
	},
}))

let urlsRepository: InMemoryUrlsRepository

describe('Export URLs CSV Service', () => {
	beforeEach(() => {
		urlsRepository = new InMemoryUrlsRepository()
		vi.clearAllMocks()
	})

	it('should be able to create an instance', async () => {
		const { ExportUrlsCsvService } = await import('./export-urls-csv')
		const sut = new ExportUrlsCsvService(urlsRepository)
		
		expect(sut).toBeInstanceOf(ExportUrlsCsvService)
	})

	it('should generate unique filenames for different calls', async () => {
		const { ExportUrlsCsvService } = await import('./export-urls-csv')
		const sut = new ExportUrlsCsvService(urlsRepository)

		// Create a test URL
		await urlsRepository.create({
			originalUrl: 'https://www.example.com',
			shortUrl: 'http://localhost:3333/example',
		})

		// Mock S3 client send method
		const mockSend = vi.fn().mockResolvedValue({})
		const mockS3Client = { send: mockSend }
		
		// Replace S3 client instance
		Object.defineProperty(sut, 's3Client', {
			value: mockS3Client,
			writable: true,
		})

		const result1 = await sut.execute()
		const result2 = await sut.execute()

		expect(result1.filename).not.toBe(result2.filename)
		expect(result1.downloadUrl).not.toBe(result2.downloadUrl)
		expect(mockSend).toHaveBeenCalledTimes(2)
	})

	it('should handle repository data correctly', async () => {
		const { ExportUrlsCsvService } = await import('./export-urls-csv')
		const sut = new ExportUrlsCsvService(urlsRepository)

		// Create test URLs
		const url1 = await urlsRepository.create({
			originalUrl: 'https://www.example.com',
			shortUrl: 'http://localhost:3333/example',
		})

		const url2 = await urlsRepository.create({
			originalUrl: 'https://www.google.com',
			shortUrl: 'http://localhost:3333/google',
		})

		// Mock S3 client send method
		let uploadedData: Buffer | null = null
		const mockSend = vi.fn().mockImplementation((command) => {
			uploadedData = command.Body
			return Promise.resolve({})
		})
		const mockS3Client = { send: mockSend }
		
		// Replace S3 client instance
		Object.defineProperty(sut, 's3Client', {
			value: mockS3Client,
			writable: true,
		})

		const result = await sut.execute()

		expect(result.downloadUrl).toContain('https://cdn.example.com/urls-export-')
		expect(result.filename).toMatch(/^urls-export-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z-[a-f0-9]+\.csv$/)
		expect(mockSend).toHaveBeenCalledTimes(1)

		// Verify CSV content
		if (uploadedData) {
			const csvContent = (uploadedData as Buffer).toString()
			expect(csvContent).toContain('ID,Original URL,Short URL,Click Count,Created At')
			expect(csvContent).toContain(url1.id)
			expect(csvContent).toContain(url2.id)
			expect(csvContent).toContain('https://www.example.com')
			expect(csvContent).toContain('https://www.google.com')
		}
	})
})