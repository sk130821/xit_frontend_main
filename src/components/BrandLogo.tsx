type BrandLogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
};

const sizes = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export default function BrandLogo({ size = 'md', showTagline = false, className = '' }: BrandLogoProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img
        src="/xit-token-logo.png"
        alt="XIT Token"
        className={`${sizes[size]} object-contain drop-shadow-lg drop-shadow-xit-gold/40`}
      />
      {showTagline && (
        <p className="text-xit-gold/80 mt-2 text-sm text-center font-medium tracking-wide">Decentralized Crypto MLM Ecosystem</p>
      )}
    </div>
  );
}
