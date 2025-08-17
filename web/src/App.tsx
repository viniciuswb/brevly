import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BrevlyApp, NotFoundPage, RedirectingPage } from './components';

function App() {
	// Mock function to simulate getting original URL from short URL
	const handleRedirect = (shortUrl: string): string | null => {
		// This would normally make an API call to get the original URL
		// For now, return null to show 404 for unknown short URLs
		
		// Mock data - you can add your own short URLs here for testing
		const mockUrls: Record<string, string> = {
			'Portfolio-Dev': 'https://devsite.portfolio.com.br/devname-123456',
			'Linkedin-Profile': 'https://linkedin.com/in/myprofile',
			'Github-Project': 'https://github.com/devname/project-name-v2',
			'Figma-Encurtador-de-Links': 'https://figma.com/design/file/Encurtador-de-Links'
		};
		
		return mockUrls[shortUrl] || null;
	};
 
	return (
		<BrowserRouter> 
			<Routes>
				<Route path="/" element={<BrevlyApp />} />
				<Route path="/404" element={<NotFoundPage />} />
				<Route 
					path="/:shortUrl" 
					element={<RedirectingPage onRedirect={handleRedirect} />} 
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
