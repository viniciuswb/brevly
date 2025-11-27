import type { Readable } from 'node:stream'

import { BlobServiceClient } from '@azure/storage-blob'

import { env } from '@/env'

const blobServiceClient = BlobServiceClient.fromConnectionString(
	env.AZURE_STORAGE_CONNECTION_STRING || ''
)

export async function uploadToAzureBlob(
	fileStream: Readable,
	filename: string,
	contentType: string
) {
	if (!env.AZURE_STORAGE_CONTAINER_NAME) {
		throw new Error('Azure Blob Storage configuration is missing')
	}

	const containerClient = blobServiceClient.getContainerClient(
		env.AZURE_STORAGE_CONTAINER_NAME
	)

	// Ensure the container exists
	await containerClient.createIfNotExists({
		access: 'blob',
	})

	const blockBlobClient = containerClient.getBlockBlobClient(filename)

	// Convert stream to buffer
	const chunks: Buffer[] = []
	for await (const chunk of fileStream) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
	}
	const buffer = Buffer.concat(chunks)

	await blockBlobClient.upload(buffer, buffer.length, {
		blobHTTPHeaders: {
			blobContentType: contentType,
		},
	})

	return { url: blockBlobClient.url }
}
