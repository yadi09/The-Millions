import React from 'react';

interface FutureVisionProps {
  content: {
    label: string;
    title: string;
    subTitle: string;
    points: string[];
    footer: string;
  };
}

export const FutureVisionSection: React.FC<FutureVisionProps> = ({ content }) => {
  const { label, title, subTitle, points, footer } = content;

  return (
    <section id="vision" className="bg-millions-mid py-20">
      <div className="max-w-[1440px] w-[94%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight">
            {title}
          </h2>
          <p className="text-white/50 text-[1.05rem] leading-relaxed font-light mt-4 lg:max-w-2xl">
            {subTitle}
          </p>
        </div>

        <div className="flex flex-col gap-px mt-10 animate-fade-in-up">
          {points.map((point, idx) => (
            <div key={idx} className="bg-white/5 p-8 flex items-start gap-10 hover:bg-white/10 transition-colors group">
              <div className="font-cormorant text-millions-accent/40 text-5xl font-light leading-none group-hover:text-millions-accent transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <p className="text-white/55 text-[1.05rem] leading-relaxed font-light pt-1">
                {point}
              </p>
            </div>
          ))}
        </div>

        <p className="text-white/45 text-[1.05rem] leading-relaxed font-light mt-12 lg:max-w-xl animate-fade-in-up md:animation-delay-300">
          {footer}
        </p>
      </div>
    </section>
  );
};
