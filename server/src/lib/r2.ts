import type { Readable } from 'node:stream'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { env } from '@/env'

const s3 = new S3Client({
	endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	region: 'auto',
	credentials: {
		accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID || '',
		secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
	},
})

export async function uploadToR2(
	fileStream: Readable,
	filename: string,
	contentType: string
) {
	if (!env.CLOUDFLARE_BUCKET || !env.CLOUDFLARE_PUBLIC_URL) {
		throw new Error('Cloudflare R2 configuration is missing')
	}

	const bucket = env.CLOUDFLARE_BUCKET

	// Convert stream to buffer to get content length
	const chunks: Buffer[] = []
	for await (const chunk of fileStream) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
	}
	const buffer = Buffer.concat(chunks)

	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: filename,
		Body: buffer,
		ContentType: contentType,
		ContentLength: buffer.length,
	})

	await s3.send(command)

	const publicUrl = new URL(filename, env.CLOUDFLARE_PUBLIC_URL).toString()

	return { url: publicUrl }
}
