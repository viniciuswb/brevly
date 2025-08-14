import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import { ZodError } from 'zod'

import { env } from '@/env'

export const app = fastify()

app.register(fastifyCors, { origin: '*' })
app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Brevly Server',
			version: '1.0.0',
		},
	},
})

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

app.get('/', async () => {
	return { hello: 'world' }
})

app.setErrorHandler((error, _request, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: 'Validation error', issues: error.format() })
	}

	if (env.NODE_ENV !== 'production') {
		console.error(error)
	} else {
		// TODO: here we should log the error to an external tool like DataDog/NewRelic/Sentry
	}

	return reply.status(500).send({ message: 'Internal server error' })
})
