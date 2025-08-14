import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createShortUrlSchema = z.object({
		originalUrl: z.string().url(),
		shortUrl: z.string().url(),
	})

	const { originalUrl, shortUrl } = createShortUrlSchema.parse(request.body)

	// const createShortUrlService =
}
