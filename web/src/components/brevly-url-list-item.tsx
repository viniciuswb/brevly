import { CopyIcon, TrashIcon } from './brevly-icons'
import { Button } from './ui'

const BASE_URL = import.meta.env.VITE_FRONTEND_URL

interface LinkItemProps {
	shortUrl: string
	originalUrl: string
	accessCount: number
	onCopy?: (shortUrl: string) => void
	onDelete?: (shortUrl: string) => void
	className?: string
}

export function LinkItem({
	shortUrl,
	originalUrl,
	accessCount,
	onCopy,
	onDelete,
	className,
}: LinkItemProps) {
	const handleCopy = () => {
		const url = new URL(shortUrl, BASE_URL).toString()
		navigator.clipboard.writeText(url)
		onCopy?.(url)
	}

	const handleDelete = () => {
		onDelete?.(shortUrl)
	}

	const handleShortUrlClick = () => {
		// Open the frontend redirecting page which will handle the redirect flow
		window.open(`/${shortUrl}`, '_blank', 'noopener,noreferrer')
	}

	return (
		<div
			className={`flex flex-row gap-5 md:gap-4 items-center justify-start py-2 ${className}`}
		>
			<div className='flex-1 flex flex-col gap-1 min-w-0'>
				<button
					type='button'
					className='text-sm font-semibold text-[#2C46B1] truncate cursor-pointer hover:underline text-left'
					onClick={handleShortUrlClick}
				>
					{new URL(shortUrl, BASE_URL).toString()}
				</button>
				<div className='text-xs text-[#4D505C] truncate'>{originalUrl}</div>
			</div>

			<div className='text-xs text-[#4D505C] text-right whitespace-nowrap'>
				{accessCount} acessos
			</div>

			<div className='flex flex-row gap-1 items-center'>
				<Button
					variant='icon'
					size='default'
					onClick={handleCopy}
					title='Copiar link'
				>
					<CopyIcon size={16} />
				</Button>

				<Button
					variant='icon'
					size='default'
					onClick={handleDelete}
					title='Excluir link'
				>
					<TrashIcon size={16} />
				</Button>
			</div>
		</div>
	)
}
