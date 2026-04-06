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
  const isSlider = pillars.length > 4;

  return (
    <section id="model" className="bg-millions-light py-[7rem] overflow-hidden">
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

        {isSlider ? (
          <ScrollingImpactSlider pillars={pillars} />
        ) : (
          <StaticImpactGrid pillars={pillars} />
        )}
      </div>
    </section>
  );
};

const StaticImpactGrid = ({ pillars }: { pillars: Pillar[] }) => {
  const getGridClass = () => {
    if (pillars.length <= 2) return "grid-cols-1 md:grid-cols-2";
    return "grid-cols-1 md:grid-cols-2"; // 3 and 4 items stay with 2 columns
  };

  return (
    <div className={`grid ${getGridClass()} gap-0.5 bg-millions-dark/5 animate-fade-in-up md:animation-delay-300`}>
      {pillars.map((pillar, idx) => (
        <PillarCard key={idx} pillar={pillar} />
      ))}
    </div>
  );
};

const ScrollingImpactSlider = ({ pillars }: { pillars: Pillar[] }) => {
  const topPillars = pillars.filter((_, i) => i % 2 === 0);
  const bottomPillars = pillars.filter((_, i) => i % 2 !== 0);

  // Speed Synchronization: Calculate duration based on item count to ensure constant velocity
  // Pixels per second target (approx)
  const PX_PER_SEC = 50; 
  // Estimated card width in pixels (matches md:w-[47vw] approx)
  const ESTIMATED_CARD_WIDTH = window.innerWidth < 768 ? window.innerWidth * 0.94 : window.innerWidth * 0.47;

  const MarqueeRow = ({ items, reverse = false }: { items: Pillar[], reverse?: boolean }) => {
    const displayItems = [...items, ...items];
    // Duration = Total distance to move (half the container) / Speed
    const duration = (items.length * ESTIMATED_CARD_WIDTH) / PX_PER_SEC;
    
    return (
      <div className="overflow-hidden marquee-mask">
        <div 
          className={`flex w-fit gap-[0.5px] ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:pause-marquee`}
          style={{ animationDuration: `${duration}s` }}
        >
          {displayItems.map((pillar, idx) => (
            <div 
              key={`${pillar.num}-${idx}`} 
              className="w-[94vw] md:w-[47vw] lg:w-[676.8px] shrink-0"
            >
              <PillarCard pillar={pillar} />
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

const PillarCard = ({ pillar, className = "" }: { pillar: Pillar; className?: string }) => (
  <div 
    className={`bg-white p-10 border-b-2 border-b-transparent hover:border-b-millions-accent hover:-translate-y-1 transition-all duration-300 group hover:shadow-[0_16px_36px_rgba(13,36,32,0.08)] ${className}`}
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
);
