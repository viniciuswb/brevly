import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";

import { InvalidUrlFormatError } from "@/services/errors/invalid-url-format-error";
import { ShortUrlAlreadyExistsError } from "@/services/errors/short-url-already-exists-error";
import { makeCreateShortUrlService } from "@/services/factories/make-create-short-url-service";

export const createUrlSchema = {
	tags: ["URLs"],
	summary: "Create a short URL",
	description: "Create a new short URL mapping",
	body: z.object({
		originalUrl: z
			.string()
			.describe("The original URL to be shortened"),
		shortUrl: z.string().describe("The short URL"),
	}),
	response: {
		201: z.object({
			id: z.string().uuid().describe("Unique identifier for the URL mapping"),
			originalUrl: z.string().url().describe("The original URL"),
			shortUrl: z.string().url().describe("The short URL"),
			clickCount: z
				.number()
				.int()
				.min(0)
				.describe("Number of times the short URL has been accessed"),
			createdAt: z.date().describe("When the URL mapping was created"),
		}),
		400: z
			.object({
				message: z.string().describe("Error message"),
			})
			.describe("Invalid URL format"),
		409: z
			.object({
				message: z.string().describe("Error message"),
			})
			.describe("Short URL already exists"),
	},
};

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createShortUrlSchema = z.object({
		originalUrl: z.string(),
		shortUrl: z.string(),
	});

	const { originalUrl, shortUrl } = createShortUrlSchema.parse(request.body);

	const createShortUrlService = makeCreateShortUrlService();

	try {
		const url = await createShortUrlService.execute({ originalUrl, shortUrl });

		return reply.status(201).send({
			...url,
		});
	} catch (error) {
		if (error instanceof InvalidUrlFormatError) {
			return reply.status(400).send({
				message: error.message,
			});
		}

		if (error instanceof ShortUrlAlreadyExistsError) {
			return reply.status(409).send({
				message: error.message,
			});
		}

		throw error;
	}
}
