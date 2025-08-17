import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
	apiService,
	type CreateUrlRequest,
	type UrlResponse,
	type ApiRequestError,
} from '../services/api'

export const useCreateUrl = () => {
	const queryClient = useQueryClient()

	return useMutation<UrlResponse, ApiRequestError, CreateUrlRequest>({
		mutationFn: (request: CreateUrlRequest) => apiService.createUrl(request),
		onSuccess: () => {
			// Invalidate and refetch any URL lists if they exist
			queryClient.invalidateQueries({ queryKey: ['urls'] })
		},
	})
}
