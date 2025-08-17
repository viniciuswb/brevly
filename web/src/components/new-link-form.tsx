import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input } from './ui'

const formSchema = z.object({
	originalUrl: z.string().url('Please enter a valid URL'),
	shortUrl: z.string().min(1, 'Short URL is required'),
})

type FormData = z.infer<typeof formSchema>

interface NewLinkFormProps {
	onSubmit?: (data: FormData) => Promise<void>
	className?: string
	isLoading?: boolean
	error?: string
}

export function NewLinkForm({
	onSubmit,
	className,
	isLoading = false,
	error,
}: NewLinkFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		mode: 'onChange',
	})

	const onFormSubmit = async (data: FormData) => {
		try {
			await onSubmit?.(data)
			reset() // Clear form on successful submission
		} catch (error) {
			// Error handling is done by parent component
			console.error('Form submission error:', error)
		}
	}

	return (
		<div className={`bg-[#F9F9FB] rounded-lg p-6 md:p-8 ${className}`}>
			<h2 className='text-lg font-bold text-[#1F2025] mb-6'>Novo link</h2>

			{error && (
				<div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-md'>
					<p className='text-sm text-red-600'>{error}</p>
				</div>
			)}

			<form
				onSubmit={handleSubmit(onFormSubmit)}
				className='flex flex-col gap-4'
			>
				<Input
					label='link original'
					placeholder='https://www.exemplo.com.br'
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

				<Button
					type='submit'
					disabled={!isValid || isLoading}
					className='w-full'
				>
					{isLoading ? 'Salvando...' : 'Salvar link'}
				</Button>
			</form>
		</div>
	)
}
