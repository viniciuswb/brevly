import { z } from "zod";

import type { NewUrl, Url } from "@/db/types";
import type { UrlsRepository } from "@/repositories/urls-repository";
import { InvalidUrlFormatError } from "./errors/invalid-url-format-error";
import { ShortUrlAlreadyExistsError } from "./errors/short-url-already-exists-error";

export class CreateShortUrlService {
	constructor(private readonly urlsRepository: UrlsRepository) {}

	async execute({ originalUrl, shortUrl }: NewUrl): Promise<Url> {
		const urlSchema = z.object({
			originalUrl: z.string().url({ message: "Invalid original URL format" }),
			shortUrl: z.string().url({ message: "Invalid short URL format" }),
		});

		const { success } = urlSchema.safeParse({ originalUrl, shortUrl });
		if (!success) {
			throw new InvalidUrlFormatError();
		}

		const existingUrl = await this.urlsRepository.findByShortUrl(shortUrl);
		if (existingUrl) {
			throw new ShortUrlAlreadyExistsError();
		}

		const url = await this.urlsRepository.create({ originalUrl, shortUrl });
		return url;
	}
}
