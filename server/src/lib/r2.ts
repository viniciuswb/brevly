import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import type { Readable } from 'stream'

import { env } from '@/env'

const s3 = new S3Client({
	endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
	region: 'auto',
	credentials: {
		accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
		secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY,
	},
})

export async function uploadToR2(
	fileStream: Readable,
	filename: string,
	contentType: string
) {
	const bucket = env.CLOUDFLARE_BUCKET

	const command = new PutObjectCommand({
		Bucket: bucket,
		Key: filename,
		Body: fileStream,
		ContentType: contentType,
	})

	await s3.send(command)

	const publicUrl = new URL(filename, env.CLOUDFLARE_PUBLIC_URL).toString()

	return { url: publicUrl }
}
