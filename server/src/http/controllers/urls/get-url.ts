import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { UrlNotFoundError } from '@/services/errors/url-not-found-error'
import { makeGetUrlService } from '@/services/factories/make-get-url-service'

export const getUrlSchema = {
	tags: ['URLs'],
	summary: 'Get a URL by its short version',
	description: 'Redirects to the original URL',
	params: z.object({
		shortUrl: z.string().describe('The short URL code'),
	}),
	response: {
		301: z.null().describe('Redirects to the original URL'),
		404: z
			.object({
				message: z.string().describe('Error message'),
			})
			.describe('URL not found'),
	},
}

export async function getUrl(request: FastifyRequest, reply: FastifyReply) {
	const getUrlParamsSchema = z.object({
		shortUrl: z.string(),
	})

	const { shortUrl } = getUrlParamsSchema.parse(request.params)

	const getUrlService = makeGetUrlService()

	try {
		const { url } = await getUrlService.execute({ shortUrl })

		return reply.redirect(301, url.originalUrl)
	} catch (error) {
		if (error instanceof UrlNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		throw error
	}
}
