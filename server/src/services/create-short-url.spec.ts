import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryUrlsRepository } from "@/repositories/in-memory/in-memory-urls-repository";
import { CreateShortUrlService } from "./create-short-url";
import { InvalidUrlFormatError } from "./errors/invalid-url-format-error";
import { ShortUrlAlreadyExistsError } from "./errors/short-url-already-exists-error";

describe("createShortUrl", () => {
	let urlsRepository: InMemoryUrlsRepository;
	let sut: CreateShortUrlService;

	beforeEach(() => {
		urlsRepository = new InMemoryUrlsRepository();
		sut = new CreateShortUrlService(urlsRepository);
	});

	it("should create a short URL", async () => {
		const { shortUrl, originalUrl } = await sut.execute({
			originalUrl: "https://google.com",
			shortUrl: "google",
		});

		expect(shortUrl).toEqual("http://localhost:3333/google");
		expect(originalUrl).toEqual("https://google.com");
	});

	it("should throw error when slug format is invalid", async () => {
		await expect(
			sut.execute({
				originalUrl: "https://google.com",
				shortUrl: "invalid slug",
			}),
		).rejects.toThrow(InvalidUrlFormatError);
	});

	it("should throw error when original URL format is invalid", async () => {
		await expect(
			sut.execute({
				originalUrl: "invalid-url",
				shortUrl: "google",
			}),
		).rejects.toThrow(InvalidUrlFormatError);
	});

	it("should throw error when slug already exists", async () => {
		// First creation should succeed
		await sut.execute({
			originalUrl: "https://google.com",
			shortUrl: "existing-slug",
		});

		// Second creation with same slug should fail
		await expect(
			sut.execute({
				originalUrl: "https://different.com",
				shortUrl: "existing-slug",
			}),
		).rejects.toThrowError(ShortUrlAlreadyExistsError);
	});
});
