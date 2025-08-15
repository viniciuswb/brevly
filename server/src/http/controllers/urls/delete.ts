import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { UrlNotFoundError } from '@/services/errors/url-not-found-error'
import { makeDeleteShortUrlService } from '@/services/factories/make-delete-short-url-service'

export const deleteUrlSchema = {
	tags: ['URLs'],
	summary: 'Delete a short URL',
	description: 'Delete a short URL mapping',
	params: z.object({
		slug: z.string().describe('The slug for the short URL'),
	}),
	response: {
		204: z.null().describe('Successfully deleted'),
		404: z
			.object({
				message: z.string().describe('Error message'),
			})
			.describe('URL not found'),
	},
}

export async function del(request: FastifyRequest, reply: FastifyReply) {
	const { slug } = deleteUrlSchema.params.parse(request.params)
	const deleteShortUrlService = makeDeleteShortUrlService()

	try {
		await deleteShortUrlService.execute({ slug })

		return reply.status(204).send()
	} catch (error) {
		if (error instanceof UrlNotFoundError) {
			return reply.status(404).send({
				message: error.message,
			})
		}

		throw error
	}
}
