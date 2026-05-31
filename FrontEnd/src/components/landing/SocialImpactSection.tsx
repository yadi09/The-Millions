import React from 'react';
import { sanitizeHtml } from '../../utils/sanitize';

interface Tier {
  badge: string;
  title: string;
  text: string;
}

interface SocialImpactProps {
  content: {
    label?: string;
    title?: string;
    subTitle?: string;
    tiers?: Tier[];
    governance?: {
      title?: string;
      paragraphs?: any[]; // Changed to any[] to handle string or object
      list?: any[];       // Changed to any[] to handle string or object
      footer?: string;
    };
  };
}

export const SocialImpactSection: React.FC<SocialImpactProps> = ({ content }) => {
  if (!content) return null;
  
  const { 
    label = "", 
    title = "", 
    subTitle = "", 
    tiers = [], 
    governance = { title: "", paragraphs: [], list: [], footer: "" } 
  } = content;
  
  const isSlider = (tiers?.length || 0) > 3;

  // Helper to extract text from a potentially object-based list item
  const renderText = (item: any) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.text || item.title || item.label || "";
    }
    return "";
  };

  return (
    <section id="impact" data-editable-section="social-impact" className="bg-millions-dark py-[7rem] px-[5%] overflow-hidden">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
            {title}
          </h2>
          <p className="text-white/50 text-[0.9rem] leading-[1.9] font-light mt-4 italic">
            {subTitle}
          </p>
        </div>

        {isSlider ? (
          <ScrollingTiersSlider tiers={tiers} />
        ) : (
          <StaticTiersGrid tiers={tiers} />
        )}

        {/* Governance Box - Always Static */}
        <div className="bg-white/5 border border-white/10 p-10 mt-10 animate-fade-in-up md:animation-delay-300">
          <h3 className="font-cormorant text-white text-[1.5rem] font-light mb-6">
            {governance?.title}
          </h3>
          <div className="space-y-4 mb-6 text-white/45 text-[0.83rem] leading-[1.8] font-light [&_p]:my-0 [&_strong]:text-white [&_strong]:font-medium [&_em]:italic [&_u]:underline">
            {(governance?.paragraphs || []).map((p, idx) => (
              <div
                key={idx}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderText(p)) }}
              />
            ))}
          </div>
          <ul className="space-y-3 mb-6">
            {(governance?.list || []).map((item, idx) => (
              <li key={idx} className="flex gap-3 text-white/45 text-[0.95rem] font-light">
                <span className="text-millions-accent">—</span> {renderText(item)}
              </li>
            ))}
          </ul>
          <div
            className="text-white/45 text-[0.83rem] leading-[1.8] font-light [&_p]:my-0 [&_strong]:text-white [&_strong]:font-medium [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(renderText(governance?.footer)) }}
          />
        </div>
      </div>
    </section>
  );
};

const StaticTiersGrid = ({ tiers }: { tiers: Tier[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
      {(tiers || []).map((tier, idx) => (
        <TierCard key={idx} tier={tier} />
      ))}
    </div>
  );
};

const ScrollingTiersSlider = ({ tiers }: { tiers: Tier[] }) => {
  const PX_PER_SEC = 50; 
  const ESTIMATED_CARD_WIDTH = window.innerWidth < 1024 ? window.innerWidth : 435.2;

  const duplicatedItems = [...(tiers || []), ...(tiers || [])];
  const duration = ((tiers?.length || 0) * ESTIMATED_CARD_WIDTH) / PX_PER_SEC;

  return (
    <div className="overflow-hidden marquee-mask py-2 animate-fade-in-up">
      <div 
        className="flex w-fit gap-6 animate-marquee hover:pause-marquee"
        style={{ animationDuration: `${duration}s` }}
      >
        {duplicatedItems.map((tier, idx) => (
          <div 
            key={`${tier.title}-${idx}`} 
            className="w-[94vw] md:w-[calc(94vw/3-16px)] lg:w-[435.2px] shrink-0"
          >
            <TierCard tier={tier} />
          </div>
        ))}
      </div>
    </div>
  );
};

const TierCard = ({ tier }: { tier: Tier }) => (
  <div className="bg-white/5 border border-white/10 p-10 border-t-2 border-t-millions-accent h-full">
    <div className="inline-block bg-millions-accent text-millions-dark text-[0.68rem] tracking-[0.2em] uppercase px-3 py-1 mb-6 font-medium">
      {tier?.badge}
    </div>
    <h3 className="font-cormorant text-white text-[1.15rem] font-light mb-4 leading-snug">
      {tier?.title}
    </h3>
    <div
      className="text-white/45 text-[0.83rem] leading-[1.8] font-light [&_p]:my-0 [&_strong]:text-white [&_strong]:font-medium [&_em]:italic [&_u]:underline"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(tier?.text || '') }}
    />
  </div>
);
