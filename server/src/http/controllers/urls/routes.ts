import type { FastifyInstance } from 'fastify'

import { createUrlSchema, create as createUrlController } from './create'
import { getUrl, getUrlSchema } from './get-url'

export async function urlsRoutes(app: FastifyInstance) {
	app.post(
		'/urls',
		{
			schema: createUrlSchema,
		},
		createUrlController,
	)

	app.get(
		'/r/:shortUrl',
		{
			schema: getUrlSchema,
		},
		getUrl,
	)
}
