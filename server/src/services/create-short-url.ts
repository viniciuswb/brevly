import { z } from "zod";

import type { Url } from "@/db/types";
import { env } from "@/env";
import type { UrlsRepository } from "@/repositories/urls-repository";
import { InvalidUrlFormatError } from "./errors/invalid-url-format-error";
import { ShortUrlAlreadyExistsError } from "./errors/short-url-already-exists-error";

interface CreateShortUrlServiceRequest {
	originalUrl: string;
	shortUrl: string; // This will be the slug from the controller
}

export class CreateShortUrlService {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute({
		originalUrl,
		shortUrl: slug,
	}: CreateShortUrlServiceRequest): Promise<Url> {
		const urlSchema = z.object({
			originalUrl: z.string().url({ message: "Invalid original URL format" }),
			slug: z
				.string()
				.regex(/^[a-z0-9-]+$/, { message: "Invalid slug format" }),
		});

		const validationResult = urlSchema.safeParse({ originalUrl, slug });
		if (!validationResult.success) {
			// TODO: Figure out how to pass the message from the zod error
			throw new InvalidUrlFormatError();
		}

		const shortUrl = new URL(slug, env.BASE_SHORT_URL).toString();

		const existingUrl = await this.urlsRepository.findByShortUrl(shortUrl);
		if (existingUrl) {
			throw new ShortUrlAlreadyExistsError();
		}

		const url = await this.urlsRepository.create({ originalUrl, shortUrl });
		return url;
	}
}
