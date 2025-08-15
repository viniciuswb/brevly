import type { FastifyInstance } from 'fastify'

import { createUrlSchema, create as urlController } from './create'
import { get as getUrlController, getUrlSchema } from './get'

export async function urlsRoutes(app: FastifyInstance) {
	app.post(
		'/urls',
		{
			schema: createUrlSchema,
		},
		urlController
	)

	app.get(
		'/urls/:shortUrl',
		{
			schema: getUrlSchema,
		},
		getUrlController
	)
}
