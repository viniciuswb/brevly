import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface RedirectingPageProps {
  onRedirect?: (shortUrl: string) => string | null;
}

export function RedirectingPage({ onRedirect }: RedirectingPageProps) {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!shortUrl) return;

    // Simulate API call to get the original URL
    const getOriginalUrl = async () => {
      // If onRedirect prop is provided, use it to get the URL
      if (onRedirect) {
        const url = onRedirect(shortUrl);
        setTargetUrl(url);
        if (url) {
          // Wait 2 seconds then redirect
          setTimeout(() => {
            setShouldRedirect(true);
          }, 2000);
        } else {
          // If URL not found, redirect to 404 page after a brief moment
          setTimeout(() => {
            navigate('/404');
          }, 1000);
        }
      } else {
        // Default behavior - simulate API call
        setTimeout(() => {
          // This would be replaced with actual API call
          const mockUrl = `https://example.com/${shortUrl}`;
          setTargetUrl(mockUrl);
          setShouldRedirect(true);
        }, 2000);
      }
    };

    getOriginalUrl();
  }, [shortUrl, onRedirect, navigate]);

  useEffect(() => {
    if (shouldRedirect && targetUrl) {
      window.location.href = targetUrl;
    }
  }, [shouldRedirect, targetUrl]);

  const handleManualRedirect = () => {
    if (targetUrl) {
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E6EC] flex items-center justify-center p-4">
      {/* Main Redirecting Content */}
      <div className="bg-[#F9F9FB] rounded-lg px-12 py-16 flex flex-col items-center justify-center gap-6 w-full max-w-[580px]">
        {/* Brevly Logo */}
        <div className="w-12 h-12 flex items-center justify-center">
          <img src="/src/components/assets/brevly-logo.svg" alt="Brevly" className="w-12 h-12" />
        </div>
        
        {/* Title */}
        <h1 className="text-[#1F2025] text-2xl font-bold leading-8 text-center">
          Redirecionando...
        </h1>
        
        {/* Description */}
        <div className="text-center w-full">
          <p className="text-[#4D505C] text-sm font-semibold leading-[18px] mb-1">
            O link será aberto automaticamente em alguns instantes.
          </p>
          <p className="text-[#4D505C] text-sm font-semibold leading-[18px]">
            Não foi redirecionado?{' '}
            <button 
              type="button"
              onClick={handleManualRedirect}
              className="text-[#2C46B1] underline decoration-from-font hover:opacity-80 focus:outline-none focus:opacity-80"
              disabled={!targetUrl}
            >
              Acesse aqui
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}