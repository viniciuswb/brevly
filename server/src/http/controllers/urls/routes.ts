import type { FastifyInstance } from 'fastify'

import { createUrlSchema, create as urlController } from './create'
import { get as getUrlController, getUrlSchema } from './get'
import { list as listUrlsController, listUrlsSchema } from './list'

export async function urlsRoutes(app: FastifyInstance) {
	app.get(
		'/urls',
		{
			schema: listUrlsSchema,
		},
		listUrlsController
	)

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
