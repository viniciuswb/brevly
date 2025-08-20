import { useMutation, useQuery } from '@tanstack/react-query'
import { z } from 'zod'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

export const createLinkSchema = z.object({
	originalUrl: z.url({ message: 'Por favor, insira uma URL válida' }),
	shortUrl: z
		.string()
		.min(1, {
			message: 'Este campo é obrigatório',
		})
		.regex(/^[a-z0-9-]+$/, {
			message: 'Use apenas letras minúsculas, números e hifens',
		}),
})

export type CreateLinkData = z.infer<typeof createLinkSchema>

export interface Link {
	id: string
	shortUrl: string
	originalUrl: string
	clickCount: number
}

async function getLinks(): Promise<Link[]> {
	const response = await fetch(`${API_BASE_URL}/urls`)
	if (!response.ok) {
		throw new Error('Failed to fetch links.')
	}
	const data = await response.json()
	return data
}

export function useGetLinks() {
	return useQuery({
		queryKey: ['links'],
		queryFn: getLinks,
	})
}

async function createLink(data: CreateLinkData) {
	const response = await fetch(`${API_BASE_URL}/urls`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.message || 'Failed to create link.')
	}

	return response.json()
}

export function useCreateLink() {
	return useMutation({
		mutationFn: createLink,
	})
}

async function deleteLink(slug: string) {
	const response = await fetch(`${API_BASE_URL}/urls/${slug}`, {
		method: 'DELETE',
	})

	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.message || 'Failed to delete link.')
	}
}

export function useDeleteLink() {
	return useMutation({
		mutationFn: deleteLink,
	})
}

async function exportUrls(): Promise<{ url: string }> {
	const response = await fetch(`${API_BASE_URL}/urls/export`)
	
	if (!response.ok) {
		const errorData = await response.json()
		throw new Error(errorData.message || 'Failed to export URLs.')
	}
	
	return response.json()
}

export function useExportUrls() {
	return useMutation({
		mutationFn: exportUrls,
	})
}
