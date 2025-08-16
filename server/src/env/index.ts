import { z } from 'zod'

const envSchema = z.object({
	PORT: z.coerce.number().default(3333),
	NODE_ENV: z.enum(['development', 'production']).default('development'),
	DATABASE_URL: z.url().startsWith('postgres://'),
	BASE_SHORT_URL: z.url(),
	CLOUDFLARE_ACCOUNT_ID: z.string(),
	CLOUDFLARE_ACCESS_KEY_ID: z.string(),
	CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
	CLOUDFLARE_BUCKET: z.string(),
	CLOUDFLARE_PUBLIC_URL: z.url(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('❌ Invalid environment variables:', _env.error.format())

	throw new Error('Invalid environment variables.')
}

export const env = _env.data
