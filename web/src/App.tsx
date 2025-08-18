import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { BrevlyApp, NotFoundPage, RedirectingPage } from './components'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

function App() {
	// Function to get original URL from short URL and increment click count
	const handleRedirect = async (shortUrl: string): Promise<string | null> => {
		try {
			// First, get all URLs to find the original URL without incrementing count
			const listResponse = await fetch(`${API_BASE_URL}/urls`)
			if (!listResponse.ok) {
				return null
			}
			
			const urls = await listResponse.json()
			
			// Find the URL that matches our short URL
			const targetUrl = urls.find((url: { shortUrl: string; originalUrl: string }) => {
				// Extract the last part of the shortUrl (the identifier)
				const shortUrlId = url.shortUrl.split('/').pop()
				return shortUrlId === shortUrl
			})
			
			if (targetUrl) {
				return targetUrl.originalUrl
			}

			return null
		} catch (error) {
			console.error('Error fetching redirect URL:', error)
			return null
		}
	}

	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<BrevlyApp />} />
				<Route path='/404' element={<NotFoundPage />} />
				<Route
					path='/:shortUrl'
					element={<RedirectingPage onRedirect={handleRedirect} />}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default App
