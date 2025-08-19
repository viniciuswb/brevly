import {
	createLinkSchema,
	useCreateLink,
	type CreateLinkData,
} from '@/http/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button, Input } from './ui'

interface NewLinkFormProps {
	onLinkCreated: () => void
	onSubmittingChange?: (isSubmitting: boolean) => void
	className?: string
}

export function NewLinkForm({ onLinkCreated, onSubmittingChange, className }: NewLinkFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<CreateLinkData>({
		resolver: zodResolver(createLinkSchema),
	})

	const createLinkMutation = useCreateLink()

	useEffect(() => {
		onSubmittingChange?.(isSubmitting)
	}, [isSubmitting, onSubmittingChange])

	const handleFormSubmit = async (data: CreateLinkData) => {
		try {
			await createLinkMutation.mutateAsync(data)
			reset()
			onLinkCreated()
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erro inesperado.'
			toast.error(
				() => (
					<div className="flex flex-col gap-1">
						<div className="font-bold text-xs">Erro no cadastro</div>
						<div className="text-xs font-normal">{errorMessage}</div>
					</div>
				),
				{
					style: {
						background: '#ef4444',
						color: 'white',
						fontSize: '12px',
						padding: '12px',
					},
				}
			)
		}
	}

	return (
		<div className={`bg-[#F9F9FB] rounded-lg p-6 md:p-8 ${className}`}>
			<h2 className='text-lg font-bold text-[#1F2025] mb-6'>Novo link</h2>

			<form
				onSubmit={handleSubmit(handleFormSubmit)}
				className='flex flex-col gap-4'
			>
				<Input
					label='link original'
					placeholder='www.exemplo.com.br'
					{...register('originalUrl')}
					error={errors.originalUrl?.message}
					required
				/>

				<Input
					label='link encurtado'
					prefix='brev.ly/'
					placeholder=''
					{...register('shortUrl')}
					error={errors.shortUrl?.message}
				/>


				<Button type='submit' disabled={isSubmitting} className='w-full'>
					{isSubmitting ? 'Salvando...' : 'Salvar link'}
				</Button>
			</form>
		</div>
	)
}
