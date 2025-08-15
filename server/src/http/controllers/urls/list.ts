import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeListUrlsService } from '@/services/factories/make-list-urls-service'

export const listUrlsSchema = {
	tags: ['URLs'],
	summary: 'List all URLs',
	description: 'Retrieve all registered URLs with their details',
	response: {
		200: z.array(z.object({
			id: z.uuid().describe('Unique identifier for the URL mapping'),
			originalUrl: z.string().describe('The original URL'),
			shortUrl: z.string().describe('The short URL'),
			clickCount: z
				.number()
				.int()
				.min(0)
				.describe('Number of times the short URL has been accessed'),
			createdAt: z.date().describe('When the URL mapping was created'),
		})).describe('List of all registered URLs'),
	},
}

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const listUrlsService = makeListUrlsService()

	try {
		const urls = await listUrlsService.execute()

		return reply.status(200).send(urls)
	} catch (error) {
		throw error
	}
}