import type { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

import { makeExportUrlsCsvService } from '@/services/factories/make-export-urls-csv-service'

export const exportUrlsCsvSchema = {
	tags: ['URLs'],
	summary: 'Export URLs to CSV',
	description:
		'Generate and upload a CSV file containing all URLs to Cloudflare R2',
	response: {
		200: z.object({
			downloadUrl: z.string().url().describe('URL to download the CSV file'),
			filename: z.string().describe('Name of the generated CSV file'),
		}),
		500: z
			.object({
				message: z.string().describe('Error message'),
			})
			.describe('Server error occurred during export'),
	},
}

export async function exportCsv(_request: FastifyRequest, reply: FastifyReply) {
	try {
		const exportUrlsCsvService = makeExportUrlsCsvService()
		const result = await exportUrlsCsvService.execute()

		return reply.status(200).send(result)
	} catch (error) {
		if (error instanceof Error) {
			return reply.status(500).send({
				message: error.message,
			})
		}

		throw error
	}
}
