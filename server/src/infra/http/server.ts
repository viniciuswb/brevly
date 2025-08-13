import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import { env } from '@/env'

const server = fastify()

server.register(fastifyCors, { origin: '*' })
server.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Upload Server',
			version: '1.0.0',
		},
	},
})

server.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

server.get('/', async () => {
	return { hello: 'world' }
})

server.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
	console.log(`HTTP server running on http://localhost:${env.PORT}`)
})
