import { useQueryClient } from '@tanstack/react-query';
import { LinkList } from './link-list';
import { Logo } from './logo';
import { NewLinkForm } from './new-link-form';
import { useGetLinks } from '@/lib/api';

export function BrevlyApp() {
  const queryClient = useQueryClient();
  const { data: links, isLoading, isError } = useGetLinks();

  const handleLinkCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['links'] });
  };

  const handleCopyLink = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    // Optional: Show success toast or feedback
    console.log('Link copied:', shortUrl);
  };

  const handleDeleteLink = (shortUrl: string) => {
    // This would be a mutation in a real app
    console.log('Delete link:', shortUrl);
  };

  const handleExportCsv = () => {
    if (!links) return;
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
      <div className="max-w-7xl mx-auto w-full">
        {/* Logo */}
        <div className="flex justify-center lg:hidden mb-8">
          <Logo />
        </div>
        
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
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center w-full">
          {/* New Link Form */}
          <div className="w-full max-w-[366px] lg:max-w-[380px]">
            <NewLinkForm onLinkCreated={handleLinkCreated} />
          </div>
          
          {/* Link List */}
          <div className="w-full max-w-[366px] lg:max-w-[580px]">
            {isLoading && <p>Loading links...</p>}
            {isError && <p>Error fetching links.</p>}
            {links && (
              <LinkList
                links={links.map(link => ({...link, accessCount: link.clickCount}))}
                onCopyLink={handleCopyLink}
                onDeleteLink={handleDeleteLink}
                onExportCsv={handleExportCsv}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}