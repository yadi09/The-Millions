import React from 'react';

interface Pillar {
  num: string;
  title: string;
  text: string;
}

interface ImpactModelProps {
  content: {
    label: string;
    title: string;
    subTitle: string;
    pillars: Pillar[];
  };
}

export const ImpactModelSection: React.FC<ImpactModelProps> = ({ content }) => {
  const { label, title, subTitle, pillars } = content;

  return (
    <section id="model" className="bg-millions-light py-20">
      <div className="max-w-[1440px] w-[94%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
              {label}
            </div>
            <h2 className="font-cormorant text-millions-dark text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight">
              {title}
            </h2>
          </div>
          <p className="text-millions-body text-[1.05rem] leading-relaxed font-light lg:max-w-md">
            {subTitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-millions-dark/5 animate-fade-in-up md:animation-delay-300">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx} 
              className="bg-white p-10 border-b-2 border-b-transparent hover:border-b-millions-accent hover:-translate-y-1 transition-all duration-300 group hover:shadow-[0_16px_36px_rgba(13,36,32,0.08)]"
            >
              <div className="font-cormorant text-millions-accent/20 text-5xl font-light leading-none mb-4 group-hover:text-millions-accent/40 transition-colors">
                {pillar.num}
              </div>
              <h3 className="font-cormorant text-millions-dark text-[1.5rem] font-light mb-3">
                {pillar.title}
              </h3>
              <p className="text-millions-body text-[0.95rem] leading-relaxed font-light">
                {pillar.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
