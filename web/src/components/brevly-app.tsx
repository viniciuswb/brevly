import { useState } from 'react';
import { LinkList } from './link-list';
import { Logo } from './logo';
import { NewLinkForm } from './new-link-form';
import { useCreateUrl } from '../hooks/useUrlMutations';
import type { UrlResponse } from '../services/api';

interface Link {
  id: string;
  shortUrl: string;
  originalUrl: string;
  accessCount: number;
}

// Convert API response to Link format for compatibility
const convertUrlResponseToLink = (urlResponse: UrlResponse): Link => ({
  id: urlResponse.id,
  shortUrl: urlResponse.shortUrl,
  originalUrl: urlResponse.originalUrl,
  accessCount: urlResponse.clickCount,
});

interface BrevlyAppProps {
  initialLinks?: Link[];
  withSampleData?: boolean;
}

const sampleLinks: Link[] = [
  {
    id: '1',
    shortUrl: 'brev.ly/Portfolio-Dev',
    originalUrl: 'devsite.portfolio.com.br/devname-123456',
    accessCount: 30
  },
  {
    id: '2',
    shortUrl: 'brev.ly/Linkedin-Profile',
    originalUrl: 'linkedin.com/in/myprofile',
    accessCount: 15
  },
  {
    id: '3',
    shortUrl: 'brev.ly/Github-Project',
    originalUrl: 'github.com/devname/project-name-v2',
    accessCount: 34
  },
  {
    id: '4',
    shortUrl: 'brev.ly/Figma-Encurtador-de-Links',
    originalUrl: 'figma.com/design/file/Encurtador-de-Links',
    accessCount: 53
  }
];

export function BrevlyApp({ initialLinks, withSampleData = true }: BrevlyAppProps) {
  const getInitialLinks = () => {
    if (initialLinks) return initialLinks;
    if (withSampleData) return sampleLinks;
    return [];
  };

  const [links, setLinks] = useState<Link[]>(getInitialLinks());
  const [submitError, setSubmitError] = useState<string>('');
  
  const createUrlMutation = useCreateUrl();

  const handleSubmitLink = async (data: { originalUrl: string; shortUrl: string }) => {
    setSubmitError('');
    
    try {
      const newUrl = await createUrlMutation.mutateAsync({
        originalUrl: data.originalUrl,
        shortUrl: data.shortUrl,
      });
      
      // Convert API response and add to links list
      const newLink = convertUrlResponseToLink(newUrl);
      setLinks(prev => [newLink, ...prev]);
    } catch (error) {
      console.error('Error creating URL:', error);
      if (error && typeof error === 'object' && 'message' in error) {
        setSubmitError(error.message as string);
      } else {
        setSubmitError('Failed to create short URL. Please try again.');
      }
      throw error; // Re-throw so form knows it failed
    }
  };

  const handleCopyLink = (shortUrl: string) => {
    // Show success toast or feedback
    console.log('Link copied:', shortUrl);
  };

  const handleDeleteLink = (shortUrl: string) => {
    setLinks(prev => prev.filter(link => link.shortUrl !== shortUrl));
  };

  const handleExportCsv = () => {
    const csvContent = [
      ['Short URL', 'Original URL', 'Access Count'],
      ...links.map(link => [link.shortUrl, link.originalUrl, link.accessCount.toString()])
    ]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brevly-links.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#E4E6EC] p-4 md:p-8 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto w-full">
        {/* Logo - positioned separately on desktop */}
        <div className="flex justify-center lg:hidden mb-8">
          <Logo />
        </div>
        
        {/* Desktop Logo - positioned absolutely to align with form */}
        <div className="hidden lg:block relative">
          <div className="flex justify-center w-full">
            <div className="flex gap-8 w-full max-w-[960px]">
              <div className="w-[380px]">
                <div className="mb-6">
                  <Logo />
                </div>
              </div>
              <div className="w-[580px]"></div>
            </div>
          </div>
        </div>
        
        {/* Main Content - both components aligned at same level */}
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center w-full">
          {/* New Link Form */}
          <div className="w-full max-w-[366px] lg:max-w-[380px]">
            <NewLinkForm 
              onSubmit={handleSubmitLink} 
              isLoading={createUrlMutation.isPending}
              error={submitError}
            />
          </div>
          
          {/* Link List */}
          <div className="w-full max-w-[366px] lg:max-w-[580px]">
            <LinkList
              links={links}
              onCopyLink={handleCopyLink}
              onDeleteLink={handleDeleteLink}
              onExportCsv={handleExportCsv}
            />
          </div>
        </div>
      </div>
    </div>
  );
}