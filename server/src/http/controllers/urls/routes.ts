import type { FastifyInstance } from 'fastify'

import { create as createUrlController, createUrlSchema } from './create'
import { del as deleteUrlController, deleteUrlSchema } from './delete'
import { exportUrls as exportUrlController, exportUrlsSchema } from './export'
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
		exportUrlController
	)

	app.post(
		'/urls',
		{
			schema: createUrlSchema,
		},
		createUrlController
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
