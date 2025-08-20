import { Logo } from './brevly-logo'
import NotFoundErrorSvg from './assets/404-error.svg'

const BASE_URL = import.meta.env.VITE_FRONTEND_URL

export function NotFoundPage() {
	return (
		<div className='min-h-screen bg-[#E4E6EC] flex flex-col items-center justify-center p-4'>
			{/* Logo positioned at top */}
			<div className='absolute top-8 left-8'>
				<Logo />
			</div>

			{/* Main 404 Content */}
			<div className='bg-[#F9F9FB] rounded-lg px-12 py-16 flex flex-col items-center justify-center gap-6 w-full max-w-[580px]'>
				{/* 404 Error Image */}
				<div className='w-[194px] h-[85px] flex items-center justify-center'>
					<img
						src={NotFoundErrorSvg}
						alt='404 Error'
						className='w-[194px] h-[85px]'
					/>
				</div>

				{/* Title */}
				<h1 className='text-[#1F2025] text-2xl font-bold leading-8 text-center'>
					Link não encontrado
				</h1>

				{/* Description */}
				<div className='text-center w-full'>
					<p className='text-[#4D505C] text-sm font-semibold leading-[18px]'>
						O link que você está tentando acessar não existe, foi removido ou é
						uma URL inválida. Saiba mais em{' '}
						<a
							href={BASE_URL}
							className='text-[#2C46B1] underline decoration-from-font'
						>
							brev.ly
						</a>
						.
					</p>
				</div>
			</div>
		</div>
	)
}
