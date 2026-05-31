import React from 'react';
import { sanitizeHtml } from '../../utils/sanitize';

interface ImpactModelProps {
  content: {
    label?: string;
    title?: string;
    subTitle?: string;
    pillars?: any[];
  };
}

export const ImpactModelSection: React.FC<ImpactModelProps> = ({ content }) => {
  if (!content) return null;
  const { label = "", title = "", subTitle = "", pillars = [] } = content;
  const isSlider = (pillars?.length || 0) > 4;

  const renderText = (item: any, field: 'text' | 'title' | 'num' = 'text') => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item[field] || item.text || item.title || item.label || "";
    }
    return "";
  };

  return (
    <section id="model" data-editable-section="impact-model" className="bg-millions-light py-[7rem] px-[5%] overflow-hidden">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16 animate-fade-in-up">
          <div>
            <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
              {label}
            </div>
            <h2 className="font-cormorant text-millions-dark text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
              {title}
            </h2>
          </div>
          <div
            className="text-millions-body text-[0.9rem] leading-[1.9] font-light lg:max-w-md [&_p]:my-0 [&_strong]:text-millions-dark [&_strong]:font-medium [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(subTitle) }}
          />
        </div>

        {isSlider ? (
          <ScrollingImpactSlider pillars={pillars} renderText={renderText} />
        ) : (
          <StaticImpactGrid pillars={pillars} renderText={renderText} />
        )}
      </div>
    </section>
  );
};

const StaticImpactGrid = ({ pillars, renderText }: { pillars: any[], renderText: any }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-0.5 bg-millions-dark/5 animate-fade-in-up md:animation-delay-300`}>
      {pillars.map((pillar, idx) => (
        <PillarCard key={idx} pillar={pillar} renderText={renderText} />
      ))}
    </div>
  );
};

const ScrollingImpactSlider = ({ pillars, renderText }: { pillars: any[], renderText: any }) => {
  const topPillars = pillars.filter((_, i) => i % 2 === 0);
  const bottomPillars = pillars.filter((_, i) => i % 2 !== 0);

  const PX_PER_SEC = 50; 
  const ESTIMATED_CARD_WIDTH = window.innerWidth < 768 ? window.innerWidth * 0.94 : window.innerWidth * 0.47;

  const MarqueeRow = ({ items, reverse = false }: { items: any[], reverse?: boolean }) => {
    const displayItems = [...items, ...items];
    const duration = (items.length * ESTIMATED_CARD_WIDTH) / PX_PER_SEC;
    
    return (
      <div className="overflow-hidden marquee-mask">
        <div 
          className={`flex w-fit gap-[0.5px] ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:pause-marquee`}
          style={{ animationDuration: `${duration}s` }}
        >
          {displayItems.map((pillar, idx) => (
            <div 
              key={`${pillar?.num || idx}-${idx}`} 
              className="w-[94vw] md:w-[47vw] lg:w-[676.8px] shrink-0"
            >
              <PillarCard pillar={pillar} renderText={renderText} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-[0.5px] bg-millions-dark/5 animate-fade-in-up">
      <MarqueeRow items={topPillars} />
      <MarqueeRow items={bottomPillars} reverse={true} />
    </div>
  );
};

const PillarCard = ({ pillar, renderText, className = "" }: { pillar: any; renderText: any; className?: string }) => (
  <div 
    className={`bg-white p-10 border-b-2 border-b-transparent hover:border-b-millions-accent hover:-translate-y-1 transition-all duration-300 group hover:shadow-[0_16px_36px_rgba(13,36,32,0.08)] ${className}`}
  >
    <div className="font-cormorant text-millions-accent/20 text-[3rem] font-light leading-none mb-4 group-hover:text-millions-accent/40 transition-colors">
      {renderText(pillar, 'num')}
    </div>
    <h3 className="font-cormorant text-millions-dark text-[1.5rem] font-light mb-3">
      {renderText(pillar, 'title')}
    </h3>
    <div
      className="text-millions-body text-[0.83rem] leading-[1.8] font-light [&_p]:my-0 [&_strong]:text-millions-dark [&_strong]:font-medium [&_em]:italic [&_u]:underline"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderText(pillar, 'text')) }}
    />
  </div>
);
