import type { Readable } from 'node:stream'

import { BlobServiceClient } from '@azure/storage-blob'

import { env } from '@/env'

export async function uploadToAzureBlob(
	fileStream: Readable,
	filename: string,
	contentType: string
) {
	if (!env.AZURE_STORAGE_CONNECTION_STRING) {
		throw new Error(
			'AZURE_STORAGE_CONNECTION_STRING environment variable is required but not set'
		)
	}

	if (!env.AZURE_STORAGE_CONTAINER_NAME) {
		throw new Error(
			'AZURE_STORAGE_CONTAINER_NAME environment variable is required but not set'
		)
	}

	const blobServiceClient = BlobServiceClient.fromConnectionString(
		env.AZURE_STORAGE_CONNECTION_STRING
	)

	const containerClient = blobServiceClient.getContainerClient(
		env.AZURE_STORAGE_CONTAINER_NAME
	)

	// Ensure the container exists with public blob access for CSV exports
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
