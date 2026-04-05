import React from 'react';

interface Region {
  label: string;
  title: string;
  subTitle: string;
  text: string;
  tags: string[];
}

interface GeographyProps {
  content: {
    label: string;
    title: string;
    subTitle: string;
    regions: Region[];
  };
}

export const GeographySection: React.FC<GeographyProps> = ({ content }) => {
  const { label, title, subTitle, regions } = content;

  return (
    <section id="geography" className="bg-millions-light py-20">
      <div className="max-w-[1440px] w-[94%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight">
            {title}
          </h2>
          <p className="text-millions-body text-[1.05rem] leading-relaxed font-light mt-4 lg:max-w-2xl">
            {subTitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
          {regions.map((region, idx) => (
            <div 
              key={idx} 
              className="bg-white p-10 border-l-[3px] border-l-millions-accent/30 hover:border-l-millions-accent transition-all duration-300"
            >
              <div className="text-millions-accent text-[0.75rem] tracking-[0.2em] uppercase mb-1 font-light">
                {region.label}
              </div>
              <h3 className="font-cormorant text-millions-dark text-[1.8rem] font-light mb-1">
                {region.title}
              </h3>
              <div className="text-millions-muted text-[0.85rem] mb-4 font-light">
                {region.subTitle}
              </div>
              <p className="text-millions-body text-[0.95rem] leading-relaxed font-light mb-6">
                {region.text}
              </p>
              <div className="flex flex-wrap gap-2">
                {region.tags.map((tag, tIdx) => (
                  <span 
                    key={tIdx} 
                    className="text-millions-body text-[0.67rem] tracking-[0.1em] uppercase px-3 py-1 border border-millions-dark/15 font-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
