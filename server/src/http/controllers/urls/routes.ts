import type { FastifyInstance } from 'fastify'

import { createUrlSchema, create as urlController } from './create'
import { del as deleteUrlController, deleteUrlSchema } from './delete'
import { exportUrls, exportUrlsSchema } from './export'
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

	app.get(
		'/urls/export',
		{
			schema: exportUrlsSchema,
		},
		exportUrls
	)

	app.post(
		'/urls',
		{
			schema: createUrlSchema,
		},
		urlController
	)

	app.get(
		'/:shortUrl',
		{
			schema: getUrlSchema,
		},
		getUrlController
	)

	app.delete(
		'/urls/:slug',
		{
			schema: deleteUrlSchema,
		},
		deleteUrlController
	)
}
