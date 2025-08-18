import { z } from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'http://localhost:3333';

export const createLinkSchema = z.object({
  originalUrl: z.string().url({ message: 'Please enter a valid URL.' }),
  shortUrl: z
    .string()
    .min(1, { message: 'Short URL cannot be empty.' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Short URL can only contain lowercase letters, numbers, and hyphens.',
    }),
});

export type CreateLinkData = z.infer<typeof createLinkSchema>;

export interface Link {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
}

async function getLinks(): Promise<Link[]> {
  const response = await fetch(`${API_BASE_URL}/urls`);
  if (!response.ok) {
    throw new Error('Failed to fetch links.');
  }
  const data = await response.json();
  return data.urls;
}

export function useGetLinks() {
  return useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  });
}

async function createLink(data: CreateLinkData) {
  const response = await fetch(`${API_BASE_URL}/urls`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create link.');
  }

  return response.json();
}

export function useCreateLink() {
  return useMutation({
    mutationFn: createLink,
  });
}
