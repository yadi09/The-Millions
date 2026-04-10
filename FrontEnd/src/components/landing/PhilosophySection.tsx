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
    <section id="philosophy" className="bg-millions-light py-[7rem] px-[5%]">
      <div className="max-w-[1200px] w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Text Content */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-3 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-[clamp(2rem,4vw,3rem)] font-light leading-tight mb-8">
            {title}
          </h2>
          <div className="space-y-4">
            {paragraphs.map((p, idx) => {
              // Robust bold parsing for **text**
              const parts = p.split(/(\*\*.*?\*\*)/);
              return (
                <p key={idx} className="text-millions-body text-[0.9rem] leading-[1.9] font-light">
                  {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={i} className="text-millions-dark font-semibold">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        </div>

        {/* Quote Box */}
        <div className="animate-fade-in-up md:animation-delay-300">
          <div className="bg-millions-dark p-12 border-t-2 border-t-millions-accent">
            <p className="font-cormorant text-white italic text-[1.1rem] leading-[1.7] mb-6 font-light">
              "{quote}"
            </p>
            <p className="text-millions-accent text-[0.72rem] tracking-[0.15em] uppercase font-light">
              — {attr}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
