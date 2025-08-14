import type { FastifyInstance } from 'fastify'

import { createUrlSchema, create as urlController } from './create'

export async function urlsRoutes(app: FastifyInstance) {
	app.post(
		'/urls',
		{
			schema: createUrlSchema,
		},
		urlController
	)
}
