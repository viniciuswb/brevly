import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { UrlNotFoundError } from '@/services/errors/url-not-found-error'
import { makeGetUrlService } from '@/services/factories/make-get-url-service'

export const getUrlSchema = {
	tags: ['URLs'],
	summary: 'Redirect to original URL from short URL',
	description: 'Redirect to the original URL using the shortened version',
	params: z.object({
		shortUrl: z.string().describe('The short URL slug to look up'),
	}),
	response: {
		302: {
			description: 'Redirect to original URL',
			type: 'null',
			headers: {
				location: {
					type: 'string',
					description: 'The original URL to redirect to',
				},
			},
		},
		404: z
			.object({
				message: z.string().describe('Error message'),
			})
			.describe('URL not found'),
	},
}

export async function get(request: FastifyRequest, reply: FastifyReply) {
	const { shortUrl } = getUrlSchema.params.parse(request.params)
	const getUrlService = makeGetUrlService()

	try {
		const url = await getUrlService.execute({ shortUrl })

		return reply.redirect(url.originalUrl, 302)
	} catch (error) {
		if (error instanceof UrlNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		throw error
	}
}
