import type { ReactNode } from 'react';

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

export default function Section({ id, className = '', children }: SectionProps) {
  return (
    <section id={id} className={`py-10 sm:py-12 md:py-14 relative scroll-mt-20 sm:scroll-mt-24 ${className}`}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative">
        {children}
      </div>
    </section>
  );
}
