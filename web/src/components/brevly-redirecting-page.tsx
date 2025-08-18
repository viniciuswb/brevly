import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

interface RedirectingPageProps {
  onRedirect?: (shortUrl: string) => Promise<string | null>;
}

export function RedirectingPage({ onRedirect }: RedirectingPageProps) {
  const { shortUrl } = useParams<{ shortUrl: string }>();
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState<string | null>(null);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!shortUrl || isProcessing) return;

    setIsProcessing(true);

    // API call to get the original URL
    const getOriginalUrl = async () => {
      // If onRedirect prop is provided, use it to get the URL
      if (onRedirect) {
        try {
          const url = await onRedirect(shortUrl);
          setTargetUrl(url);
          if (url) {
            // Wait 1.5 seconds then redirect
            setTimeout(() => {
              setShouldRedirect(true);
            }, 1500);
          } else {
            // If URL not found, redirect to 404 page after a brief moment
            setTimeout(() => {
              navigate('/404');
            }, 1000);
          }
        } catch (error) {
          console.error('Error getting redirect URL:', error);
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
  }, [shortUrl, onRedirect, navigate, isProcessing]);

  useEffect(() => {
    if (shouldRedirect && targetUrl && shortUrl) {
      // Increment count before redirecting
      fetch(`${API_BASE_URL}/${shortUrl}`, {
        method: 'GET',
        mode: 'no-cors'
      }).catch(() => {
        // Ignore errors since we're using no-cors
      }).finally(() => {
        // Redirect regardless of count increment success
        window.location.href = targetUrl;
      });
    }
  }, [shouldRedirect, targetUrl, shortUrl]);

  const handleManualRedirect = () => {
    if (targetUrl && shortUrl) {
      // Increment count before redirecting
      fetch(`${API_BASE_URL}/${shortUrl}`, {
        method: 'GET',
        mode: 'no-cors'
      }).catch(() => {
        // Ignore errors since we're using no-cors
      }).finally(() => {
        // Redirect regardless of count increment success
        window.location.href = targetUrl;
      });
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
          {!targetUrl ? (
            <p className="text-[#4D505C] text-sm font-semibold leading-[18px] mb-1">
              Buscando o link de destino...
            </p>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}