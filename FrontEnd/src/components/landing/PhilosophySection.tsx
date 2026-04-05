import React from 'react';

interface PhilosophyProps {
  content: {
    label: string;
    title: string;
    paragraphs: string[];
    quote: string;
    attr: string;
  };
}

export const PhilosophySection: React.FC<PhilosophyProps> = ({ content }) => {
  const { label, title, paragraphs, quote, attr } = content;

  return (
    <section id="philosophy" className="bg-millions-light py-20">
      <div className="max-w-[1440px] w-[94%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Text Content */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-3 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight mb-8">
            {title}
          </h2>
          <div className="space-y-4">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-millions-body text-[1.05rem] leading-relaxed font-light">
                {p.includes('THE MILLIONS was founded to bridge this gap.') ? (
                  <>
                    {p.split('THE MILLIONS was founded to bridge this gap.')[0]}
                    <strong className="text-millions-dark font-semibold">THE MILLIONS was founded to bridge this gap.</strong>
                    {p.split('THE MILLIONS was founded to bridge this gap.')[1]}
                  </>
                ) : p}
              </p>
            ))}
          </div>
        </div>

        {/* Quote Box */}
        <div className="animate-fade-in-up md:animation-delay-300">
          <div className="bg-millions-dark p-12 border-t-2 border-t-millions-accent">
            <p className="font-cormorant text-white italic text-xl md:text-[1.2rem] leading-relaxed mb-6 font-light">
              "{quote}"
            </p>
            <p className="text-millions-accent text-[0.8rem] tracking-[0.15em] uppercase font-light">
              — {attr}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
