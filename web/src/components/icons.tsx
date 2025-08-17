import {
	Copy as PhosphorCopy,
	Trash as PhosphorTrash,
	DownloadSimple as PhosphorDownload,
	Link as PhosphorLink,
} from 'phosphor-react'

interface IconProps {
	className?: string
	size?: number
}

export function CopyIcon({ className, size = 16 }: IconProps) {
	return <PhosphorCopy size={size} className={className} weight='regular' />
}

export function TrashIcon({ className, size = 16 }: IconProps) {
	return <PhosphorTrash size={size} className={className} weight='regular' />
}

export function DownloadIcon({ className, size = 16 }: IconProps) {
	return <PhosphorDownload size={size} className={className} weight='regular' />
}

export function LinkIcon({ className, size = 32 }: IconProps) {
	return <PhosphorLink size={size} className={className} weight='regular' />
}
