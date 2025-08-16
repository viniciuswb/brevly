import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeExportUrlsService } from '@/services/factories/make-export-urls-service'

export const exportUrlsSchema = {
	summary: 'Export all URLs to a CSV file',
	tags: ['URLs'],
	response: {
		201: z.object({
			url: z.url(),
		}),
	},
}

export async function exportUrls(
	_request: FastifyRequest,
	reply: FastifyReply
) {
	const exportUrlsService = makeExportUrlsService()

	const { url } = await exportUrlsService.execute()

	return reply.status(201).send({ url })
}
