import { z } from 'zod'

// API URL from environment
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333'

// Schema definitions matching backend API
export const CreateUrlRequestSchema = z.object({
	originalUrl: z.string().url('Please enter a valid URL'),
	shortUrl: z.string().min(1, 'Short URL is required'),
})

export const UrlResponseSchema = z.object({
	id: z.string().uuid(),
	originalUrl: z.string(),
	shortUrl: z.string(),
	clickCount: z.number().int().min(0),
	createdAt: z.coerce.date(),
})

export const ApiErrorSchema = z.object({
	message: z.string(),
})

export type CreateUrlRequest = z.infer<typeof CreateUrlRequestSchema>
export type UrlResponse = z.infer<typeof UrlResponseSchema>
export type ApiError = z.infer<typeof ApiErrorSchema>

// API Error class
export class ApiRequestError extends Error {
	public status: number
	public data?: unknown

	constructor(message: string, status: number, data?: unknown) {
		super(message)
		this.name = 'ApiRequestError'
		this.status = status
		this.data = data
	}
}

// API Service
export class ApiService {
	private async request<T>(
		endpoint: string,
		options: RequestInit = {}
	): Promise<T> {
		const url = `${API_BASE_URL}${endpoint}`
		const config: RequestInit = {
			headers: {
				'Content-Type': 'application/json',
				...options.headers,
			},
			...options,
		}

		try {
			const response = await fetch(url, config)

			if (!response.ok) {
				let errorMessage = `HTTP error! status: ${response.status}`
				let errorData: unknown

				try {
					errorData = await response.json()
					const parsedError = ApiErrorSchema.safeParse(errorData)
					if (parsedError.success) {
						errorMessage = parsedError.data.message
					}
				} catch {
					// If JSON parsing fails, use default error message
				}

				throw new ApiRequestError(errorMessage, response.status, errorData)
			}

			const data = await response.json()
			return data as T
		} catch (error) {
			if (error instanceof ApiRequestError) {
				throw error
			}
			throw new ApiRequestError('Network error occurred', 0, error)
		}
	}

	async createUrl(request: CreateUrlRequest): Promise<UrlResponse> {
		const validatedRequest = CreateUrlRequestSchema.parse(request)

		const response = await this.request<UrlResponse>('/urls', {
			method: 'POST',
			body: JSON.stringify(validatedRequest),
		})

		return UrlResponseSchema.parse(response)
	}
}

// Export a singleton instance
export const apiService = new ApiService()
