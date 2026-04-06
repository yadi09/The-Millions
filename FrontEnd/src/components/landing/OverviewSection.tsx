import React from 'react';

interface OverviewProps {
  content: {
    label: string;
    title: string;
    paragraphs: string[];
  };
}

export const OverviewSection: React.FC<OverviewProps> = ({ content }) => {
  const { label, title, paragraphs } = content;

  return (
    <section id="overview" className="bg-millions-mid py-[7rem]">
      <div className="max-w-[1440px] w-[94%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-3 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight">
            {title}
          </h2>
        </div>
        <div className="animate-fade-in-up md:animation-delay-300">
          <div className="space-y-6">
            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-white/55 text-[1.05rem] leading-relaxed font-light">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
