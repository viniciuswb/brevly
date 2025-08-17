import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { LinkList } from './link-list';
import { Logo } from './logo';
import { NewLinkForm } from './new-link-form';
import { api } from '../lib/api';

interface Link {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
}

interface BrevlyAppProps {
  initialLinks?: Link[];
  withSampleData?: boolean;
}

const sampleLinks: Link[] = [
  {
    id: '1',
    shortUrl: 'brev.ly/Portfolio-Dev',
    originalUrl: 'devsite.portfolio.com.br/devname-123456',
    clickCount: 30
  },
  {
    id: '2',
    shortUrl: 'brev.ly/Linkedin-Profile',
    originalUrl: 'linkedin.com/in/myprofile',
    clickCount: 15
  },
  {
    id: '3',
    shortUrl: 'brev.ly/Github-Project',
    originalUrl: 'github.com/devname/project-name-v2',
    clickCount: 34
  },
  {
    id: '4',
    shortUrl: 'brev.ly/Figma-Encurtador-de-Links',
    originalUrl: 'figma.com/design/file/Encurtador-de-Links',
    clickCount: 53
  }
];

export function BrevlyApp({ initialLinks, withSampleData = true }: BrevlyAppProps) {
  const getInitialLinks = () => {
    if (initialLinks) return initialLinks;
    if (withSampleData) return sampleLinks;
    return [];
  };

  const [links, setLinks] = useState<Link[]>(getInitialLinks());

  const handleSubmitLink = async (originalUrl: string, shortUrl?: string) => {
    try {
      const response = await api.post('/urls', {
        originalUrl,
        shortUrl,
      });

      const newLink = response.data;
      setLinks(prev => [newLink, ...prev]);
      toast.success('Link created successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create link';
      toast.error(message);
      throw error;
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
      ...links.map(link => [link.shortUrl, link.originalUrl, link.clickCount.toString()])
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
      <Toaster />
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
            <NewLinkForm onSubmit={handleSubmitLink} />
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