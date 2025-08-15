import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "@/app";

describe("Create a shortUrl (e2e)", () => {
	beforeAll(async () => {
		await app.ready();
	});

	afterAll(async () => {
		await app.close();
	});

	it("should be able to create a shortUrl", async () => {
		const response = await request(app.server).post("/urls").send({
			originalUrl: "https://google.com",
			shortUrl: "google",
		});

		expect(response.statusCode).toBe(201);
		expect(response.body.shortUrl).toEqual("http://localhost:3333/google");
	});

	it("should return 409 when slug already exists", async () => {
		// Create first URL
		await request(app.server).post("/urls").send({
			originalUrl: "https://example.com",
			shortUrl: "duplicate-slug",
		});

		// Try to create same slug again
		const response = await request(app.server).post("/urls").send({
			originalUrl: "https://different.com",
			shortUrl: "duplicate-slug",
		});

		expect(response.statusCode).toBe(409);
		expect(response.body).toEqual({
			message: "Short URL already exists",
		});
	});

	it("should return 400 for invalid originalUrl", async () => {
		const response = await request(app.server).post("/urls").send({
			originalUrl: "invalid-url",
			shortUrl: "test-slug",
		});

		expect(response.statusCode).toBe(400);
	});

	it("should return 400 for invalid slug", async () => {
		const response = await request(app.server).post("/urls").send({
			originalUrl: "https://valid.com",
			shortUrl: "invalid slug",
		});

		expect(response.statusCode).toBe(400);
	});

	it("should persist URL data to database", async () => {
		const urlData = {
			originalUrl: "https://persistence-test.com",
			shortUrl: "persist-slug",
		};

		const response = await request(app.server).post("/urls").send(urlData);

		expect(response.statusCode).toBe(201);

		// Verify the data matches what we sent, with slug converted to full URL
		expect(response.body.originalUrl).toBe(urlData.originalUrl);
		expect(response.body.shortUrl).toBe(
			`http://localhost:3333/${urlData.shortUrl}`,
		);
		expect(response.body.clickCount).toBe(0);
		expect(response.body.id).toBeDefined();
		expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
	});
});
