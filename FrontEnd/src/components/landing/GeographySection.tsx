import React from 'react';
import { sanitizeHtml } from '../../utils/sanitize';

interface GeographyProps {
  content: {
    label?: string;
    title?: string;
    subTitle?: string;
    regions?: any[]; // Changed to any[] for safety
  };
}

export const GeographySection: React.FC<GeographyProps> = ({ content }) => {
  if (!content) return null;
  const { label = "", title = "", subTitle = "", regions = [] } = content;
  const isSlider = (regions?.length || 0) > 2;

  return (
    <section id="geography" data-editable-section="geography" className="bg-millions-light py-[7rem] px-[5%] overflow-hidden">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
            {title}
          </h2>
          <div
            className="text-millions-body text-[0.9rem] leading-[1.9] font-light mt-4 lg:max-w-2xl [&_p]:my-0 [&_strong]:text-millions-dark [&_strong]:font-medium [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(subTitle) }}
          />
        </div>

        {isSlider ? (
          <ScrollingGeographySlider regions={regions} />
        ) : (
          <StaticGeographyGrid regions={regions} />
        )}
      </div>
    </section>
  );
};

const StaticGeographyGrid = ({ regions }: { regions: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
      {(regions || []).map((region, idx) => (
        <RegionCard key={idx} region={region} />
      ))}
    </div>
  );
};

const ScrollingGeographySlider = ({ regions }: { regions: any[] }) => {
  // Speed Sync Velocity
  const PX_PER_SEC = 50; 
  const ESTIMATED_CARD_WIDTH = window.innerWidth < 1024 ? window.innerWidth * 0.47 : 660.8;

  const duplicatedItems = [...(regions || []), ...(regions || [])];
  const duration = ((regions?.length || 0) * ESTIMATED_CARD_WIDTH) / PX_PER_SEC;

  return (
    <div className="overflow-hidden marquee-mask py-4 animate-fade-in-up">
      <div 
        className="flex w-fit gap-8 animate-marquee hover:pause-marquee"
        style={{ animationDuration: `${duration}s` }}
      >
        {duplicatedItems.map((region, idx) => (
          <div 
            key={`${region?.title || idx}-${idx}`} 
            className="w-[94vw] md:w-[47vw] lg:w-[660.8px] shrink-0"
          >
            <RegionCard region={region} />
          </div>
        ))}
      </div>
    </div>
  );
};

const RegionCard = ({ region }: { region: any }) => (
  <div className="bg-white p-10 border-l-[3px] border-l-millions-accent/30 hover:border-l-millions-accent transition-all duration-350 h-full">
    <div className="text-millions-accent text-[0.68rem] tracking-[0.2em] uppercase mb-1 font-light">
      {region?.label}
    </div>
    <h3 className="font-cormorant text-millions-dark text-[1.6rem] font-light mb-1">
      {region?.title}
    </h3>
    <div className="text-millions-muted text-[0.78rem] mb-4 font-light">
      {region?.subTitle}
    </div>
    <div
      className="text-millions-body text-[0.83rem] leading-[1.8] font-light mb-6 [&_p]:my-0 [&_strong]:text-millions-dark [&_strong]:font-medium [&_em]:italic [&_u]:underline"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(region?.text || '') }}
    />
    <div className="flex flex-wrap gap-2">
      {(region?.tags || []).map((tag: any, tIdx: number) => (
        <span 
          key={tIdx} 
          className="text-millions-body text-[0.67rem] tracking-[0.1em] uppercase px-3 py-1 border border-millions-dark/15 font-light"
        >
          {typeof tag === 'string' ? tag : (tag?.text || tag?.title || tag?.label || "")}
        </span>
      ))}
    </div>
  </div>
);
