import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { UrlNotFoundError } from '@/services/errors/url-not-found-error'
import { makeGetUrlService } from '@/services/factories/make-get-url-service'

export const getUrlSchema = {
	tags: ['URLs'],
	summary: 'Get original URL from short URL',
	description: 'Retrieve the original URL using the shortened version',
	params: z.object({
		shortUrl: z.string().describe('The short URL slug to look up'),
	}),
	response: {
		200: z.object({
			id: z.uuid().describe('Unique identifier for the URL mapping'),
			originalUrl: z.string().describe('The original URL'),
			shortUrl: z.string().describe('The short URL'),
			clickCount: z
				.number()
				.int()
				.min(0)
				.describe('Number of times the short URL has been accessed'),
			createdAt: z.date().describe('When the URL mapping was created'),
		}),
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

		return reply.status(200).send({
			...url,
		})
	} catch (error) {
		if (error instanceof UrlNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		throw error
	}
}
