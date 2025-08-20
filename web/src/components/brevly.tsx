import { useDeleteLink, useGetLinks, useExportUrls } from '@/http/api'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { NewLinkForm } from './brevly-link-form'
import { Logo } from './brevly-logo'
import { LinkList } from './brevly-url-list'

export function BrevlyApp() {
	const queryClient = useQueryClient()
	const { data: links, isLoading, isError } = useGetLinks()
	const deleteLink = useDeleteLink()
	const exportUrls = useExportUrls()
	const [isSaving, setIsSaving] = useState(false)
	const [isExporting, setIsExporting] = useState(false)

	const handleLinkCreated = () => {
		queryClient.invalidateQueries({ queryKey: ['links'] })
	}

	const handleSubmittingChange = (isSubmitting: boolean) => {
		setIsSaving(isSubmitting)
	}

	const handleCopyLink = (shortUrl: string) => {
		navigator.clipboard.writeText(shortUrl)
		toast(
			() => (
				<div className="flex flex-col gap-1">
					<div className="font-bold text-xs">Link copiado</div>
					<div className="text-xs font-normal">O link foi copiado para a área de transferência</div>
				</div>
			),
			{
				style: {
					background: '#2C46B1',
					color: 'white',
					fontSize: '12px',
					padding: '12px',
				},
			}
		)
	}

	const handleDeleteLink = async (shortUrl: string) => {
		// Ask for confirmation
		const confirmed = window.confirm('Tem certeza que deseja excluir este link?')
		if (!confirmed) return

		// Extract slug from shortUrl (e.g., "http://localhost:3333/abc123" -> "abc123")
		const slug = shortUrl.split('/').pop()
		if (!slug) return
		
		try {
			await deleteLink.mutateAsync(slug)
			queryClient.invalidateQueries({ queryKey: ['links'] })
			
			// Show success toast
			toast(
				() => (
					<div className="flex flex-col gap-1">
						<div className="font-bold text-xs">Link excluído</div>
						<div className="text-xs font-normal">O link foi excluído com sucesso</div>
					</div>
				),
				{
					style: {
						background: '#22c55e',
						color: 'white',
						fontSize: '12px',
						padding: '12px',
					},
				}
			)
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Erro inesperado ao excluir link.'
			toast.error(
				() => (
					<div className="flex flex-col gap-1">
						<div className="font-bold text-xs">Erro ao excluir</div>
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

	const handleExportCsv = async () => {
		if (!links) return
		
		setIsExporting(true)
		
		try {
			const { url } = await exportUrls.mutateAsync()
			
			const a = document.createElement('a')
			a.href = url
			a.download = 'brevly-links.csv'
			a.click()
			
			toast(
				() => (
					<div className="flex flex-col gap-1">
						<div className="font-bold text-xs">CSV Gerado com sucesso</div>
					</div>
				),
				{
					style: {
						background: '#22c55e',
						color: 'white',
						fontSize: '12px',
						padding: '12px',
					},
				}
			)
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Error when trying to generate CSV'
			toast.error(
				() => (
					<div className="flex flex-col gap-1">
						<div className="font-bold text-xs">Erro ao gerar CSV</div>
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
		} finally {
			setIsExporting(false)
		}
	}

	return (
		<div className='min-h-screen bg-[#E4E6EC] p-4 md:p-8 flex flex-col justify-center'>
			<div className='max-w-7xl mx-auto w-full'>
				{/* Logo */}
				<div className='flex justify-center lg:hidden mb-8'>
					<Logo />
				</div>

				<div className='hidden lg:block relative'>
					<div className='flex justify-center w-full'>
						<div className='flex gap-8 w-full max-w-[960px]'>
							<div className='w-[380px]'>
								<div className='mb-6'>
									<Logo />
								</div>
							</div>
							<div className='w-[580px]'></div>
						</div>
					</div>
				</div>

				{/* Main Content */}
				<div className='flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center w-full'>
					{/* New Link Form */}
					<div className='w-full max-w-[366px] lg:max-w-[380px]'>
						<NewLinkForm 
							onLinkCreated={handleLinkCreated} 
							onSubmittingChange={handleSubmittingChange}
						/>
					</div>

					{/* Link List */}
					<div className='w-full max-w-[366px] lg:max-w-[580px]'>
						<LinkList
							links={
								links
									? links.map(link => ({
											...link,
											accessCount: link.clickCount,
										}))
									: []
							}
							onCopyLink={handleCopyLink}
							onDeleteLink={handleDeleteLink}
							onExportCsv={handleExportCsv}
							isLoading={isLoading}
							isSaving={isSaving}
							isExporting={isExporting}
							isError={isError}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
