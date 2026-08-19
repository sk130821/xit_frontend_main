type GlobeVisualProps = {
  className?: string;
};

export default function GlobeVisual({ className = '' }: GlobeVisualProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="absolute h-[220px] w-[220px] sm:h-[360px] sm:w-[360px] lg:h-[480px] lg:w-[480px] rounded-full bg-[#f3ba2f]/20 blur-3xl" />
      <div className="relative z-10 w-[88%] max-w-[560px]">
        <div className="pointer-events-none absolute inset-[14%] rounded-full overflow-hidden">
          <img
            src="/images/xit-mercury-earth.png"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex w-[200%] animate-roadmap-earth">
            <img
              src="/images/xit-mercury-earth-map.png"
              alt=""
              className="h-full w-1/2 object-cover object-left"
            />
            <img
              src="/images/xit-mercury-earth-map.png"
              alt=""
              className="h-full w-1/2 object-cover object-left"
            />
          </div>
        </div>
        <img
          src="/images/xit-mercury-earth-cover.png"
          alt="XIT global network"
          className="relative z-10 w-full h-auto object-contain drop-shadow-[0_0_50px_rgba(243,186,47,0.45)]"
        />
      </div>
    </div>
  );
}
