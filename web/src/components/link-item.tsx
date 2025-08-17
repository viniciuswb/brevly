import { Button } from './ui'
import { CopyIcon, TrashIcon } from './icons'

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
		navigator.clipboard.writeText(shortUrl)
		onCopy?.(shortUrl)
	}

	const handleDelete = () => {
		onDelete?.(shortUrl)
	}

	return (
		<div
			className={`flex flex-row gap-5 md:gap-4 items-center justify-start py-2 ${className}`}
		>
			<div className='flex-1 flex flex-col gap-1 min-w-0'>
				<div className='text-sm font-semibold text-[#2C46B1] truncate'>
					{shortUrl}
				</div>
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
