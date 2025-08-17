import { useState } from 'react';
import { Button, Input } from './ui';

interface NewLinkFormProps {
  onSubmit?: (originalUrl: string, shortUrl: string) => Promise<void>;
  className?: string;
}

export function NewLinkForm({ onSubmit, className }: NewLinkFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit?.(originalUrl, shortUrl);
      setOriginalUrl('');
      setShortUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = originalUrl.trim().length > 0;

  return (
    <div className={`bg-[#F9F9FB] rounded-lg p-6 md:p-8 ${className}`}>
      <h2 className="text-lg font-bold text-[#1F2025] mb-6">
        Novo link
      </h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="link original"
          placeholder="www.exemplo.com.br"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
        
        <Input
          label="link encurtado"
          prefix="brev.ly/"
          placeholder=""
          value={shortUrl}
          onChange={(e) => setShortUrl(e.target.value)}
        />
        
        <Button
          type="submit"
          disabled={!isFormValid || isLoading}
          className="w-full"
        >
          {isLoading ? 'Salvando...' : 'Salvar link'}
        </Button>
      </form>
    </div>
  );
}