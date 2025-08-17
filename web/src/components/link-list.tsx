import { Button } from './ui';
import { DownloadIcon, LinkIcon } from './icons';
import { LinkItem } from './link-item';

interface Link {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
}

interface LinkListProps {
  links: Link[];
  onCopyLink?: (shortUrl: string) => void;
  onDeleteLink?: (shortUrl: string) => void;
  onExportCsv?: () => void;
  className?: string;
}

function EmptyState() {
  return (
    <div className="flex flex-col gap-3 items-center justify-center py-10">
      <LinkIcon className="text-[#7C7C8A]" size={32} />
      <p className="text-xs text-[#4D505C] text-center uppercase leading-[14px] max-w-[284px]">
        ainda não existem links cadastrados
      </p>
    </div>
  );
}

function Divider() {
  return <hr className="border-0 h-px bg-[#E4E6EC] w-full" />;
}

export function LinkList({ 
  links, 
  onCopyLink, 
  onDeleteLink, 
  onExportCsv,
  className 
}: LinkListProps) {
  const hasLinks = links.length > 0;

  return (
    <div className={`bg-[#F9F9FB] rounded-lg p-6 md:p-8 ${className}`}>
      <div className="flex flex-row items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-[#1F2025]">
          Meus links
        </h2>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={onExportCsv}
          disabled={!hasLinks}
          className={`flex items-center gap-1.5 !bg-[#E4E6EC] !border-transparent !text-[#4D505C] hover:!border-[#2C46B1] hover:!bg-[#E4E6EC] hover:!text-[#4D505C] !rounded-sm ${
            !hasLinks 
              ? 'opacity-50 cursor-not-allowed hover:!border-transparent' 
              : ''
          }`}
        >
          <DownloadIcon size={16} />
          Baixar CSV
        </Button>
      </div>
      
      <div className="flex flex-col gap-4">
        <Divider />
        
        {hasLinks ? (
          <div className="flex flex-col gap-3">
            {links.map((link, index) => (
              <div key={link.id}>
                <LinkItem
                  shortUrl={link.shortUrl}
                  originalUrl={link.originalUrl}
                  accessCount={link.clickCount}
                  onCopy={onCopyLink}
                  onDelete={onDeleteLink}
                />
                {index < links.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}