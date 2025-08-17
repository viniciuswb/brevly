import BrevlyLogoSvg from './assets/brevly-logo.svg';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Logo Icon - Exact Brevly logo from Figma */}
      <div className="relative w-[27px] h-[23px]">
        <img 
          src={BrevlyLogoSvg} 
          alt="Brevly Logo" 
          className="w-full h-full"
        />
      </div>
      
      {/* Logo Text */}
      <span 
        className="text-[#2C46B1] font-bold leading-normal font-quicksand"
        style={{ fontSize: '18.667px' }}
      >
        brev.ly
      </span>
    </div>
  );
}