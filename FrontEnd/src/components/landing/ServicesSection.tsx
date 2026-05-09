import React from 'react';

interface ServiceItem {
  title: string;
  text: string;
}

interface ServicesProps {
  content: {
    label: string;
    title: string;
    items: ServiceItem[];
    footer: {
      title: string;
      text: string;
    };
  };
}

export const ServicesSection: React.FC<ServicesProps> = ({ content }) => {
  const { label, title, items, footer } = content;
  const isSlider = items.length > 4;

  return (
    <section id="services" className="bg-millions-mid py-[7rem] px-[5%] overflow-hidden">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
            {title}
          </h2>
        </div>

        {isSlider ? (
          <ScrollingServicesSlider items={items} />
        ) : (
          <StaticServicesGrid items={items} />
        )}

        {/* Integrated Banner - Always Static */}
        <div className="bg-millions-accent/10 border-l-4 border-l-millions-accent p-8 md:p-10 mt-8 animate-fade-in-up md:animation-delay-300">
          <h3 className="font-cormorant text-millions-accent text-[1.2rem] md:text-[1.2rem] font-light mb-3">
            {footer.title}
          </h3>
          <p className="text-white/50 text-[0.83rem] leading-[1.8] font-light">
            {footer.text}
          </p>
        </div>
      </div>
    </section>
  );
};

const StaticServicesGrid = ({ items }: { items: ServiceItem[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
      {items.map((item, idx) => (
        <ServiceCard key={idx} item={item} />
      ))}
    </div>
  );
};

const ScrollingServicesSlider = ({ items }: { items: ServiceItem[] }) => {
  const topItems = items.filter((_, i) => i % 2 === 0);
  const bottomItems = items.filter((_, i) => i % 2 !== 0);

  // Speed Sync Velocity
  const PX_PER_SEC = 50; 
  const ESTIMATED_CARD_WIDTH = window.innerWidth < 1024 ? window.innerWidth * 0.47 : 676.8;

  const MarqueeRow = ({ rowItems, reverse = false }: { rowItems: ServiceItem[], reverse?: boolean }) => {
    const displayItems = [...rowItems, ...rowItems];
    const duration = (rowItems.length * ESTIMATED_CARD_WIDTH) / PX_PER_SEC;

    return (
      <div className="overflow-hidden marquee-mask py-2">
        <div 
          className={`flex w-fit gap-6 ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:pause-marquee`}
          style={{ animationDuration: `${duration}s` }}
        >
          {displayItems.map((item, idx) => (
            <div 
              key={`${item.title}-${idx}`} 
              className="w-[94vw] md:w-[47vw] lg:w-[calc(1440px*0.94/2-12px)] shrink-0"
            >
              <ServiceCard item={item} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      <MarqueeRow rowItems={topItems} />
      <MarqueeRow rowItems={bottomItems} reverse={true} />
    </div>
  );
};

const ServiceCard = ({ item }: { item: ServiceItem }) => (
  <div className="bg-white/5 border border-white/10 p-10 border-t-2 border-t-transparent hover:border-t-millions-accent hover:bg-white/10 transition-all duration-350 h-full">
    <h3 className="font-cormorant text-white text-[1.5rem] font-light mb-4">
      {item.title}
    </h3>
    <p className="text-white/45 text-[0.83rem] leading-[1.8] font-light">
      {item.text}
    </p>
  </div>
);
