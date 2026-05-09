import React from 'react';

interface ValueItem {
  name: string;
  text: string;
}

interface ValuesProps {
  content: {
    label: string;
    title: string;
    subTitle: string;
    items: ValueItem[];
  };
}

export const ValuesSection: React.FC<ValuesProps> = ({ content }) => {
  const { label, title, subTitle, items } = content;
  const isSlider = items.length > 7;

  return (
    <section id="values" className="bg-millions-dark py-[7rem] px-[5%] overflow-hidden border-t border-white/5">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
            {title}
          </h2>
          <p className="text-white/50 text-[0.9rem] leading-[1.9] font-light mt-2 italic">
            {subTitle}
          </p>
        </div>

        {isSlider ? (
          <ScrollingValuesSlider items={items} />
        ) : (
          <StaticValuesGrid items={items} />
        )}
      </div>
    </section>
  );
};

const StaticValuesGrid = ({ items }: { items: ValueItem[] }) => {
  // If exactly 7 items, use the custom 4+3 layout
  if (items.length === 7) {
    const row1 = items.slice(0, 4);
    const row2 = items.slice(4, 7);
    
    return (
      <div className="flex flex-col gap-[1px]">
        {/* Row 1: 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/5 animate-fade-in-up">
          {row1.map((item, idx) => (
            <ValueCard key={idx} name={item.name} text={item.text} />
          ))}
        </div>
        {/* Row 2: Custom grid 2fr 1fr 1fr */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-[1px] bg-white/5 animate-fade-in-up">
          {row2.map((item, idx) => (
            <ValueCard key={idx} name={item.name} text={item.text} />
          ))}
        </div>
      </div>
    );
  }

  // Otherwise use the flexible balanced grid
  const getGridCols = () => {
    if (items.length <= 3) return "lg:grid-cols-3";
    if (items.length === 4) return "lg:grid-cols-4";
    return "lg:grid-cols-3";
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 ${getGridCols()} gap-[1px] bg-white/5 animate-fade-in-up`}>
      {items.map((item, idx) => (
        <ValueCard key={idx} name={item.name} text={item.text} />
      ))}
    </div>
  );
};

const ScrollingValuesSlider = ({ items }: { items: ValueItem[] }) => {
  // We duplicate the items to create a seamless "circle" effect
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative animate-fade-in-up md:animation-delay-300">
      <div className="overflow-hidden">
        <div className="flex w-fit animate-marquee hover:pause-marquee">
          {duplicatedItems.map((item, idx) => (
            <div 
              key={idx} 
              className="w-[300px] md:w-[400px] shrink-0 p-[0.5px]"
            >
              <ValueCard 
                name={item.name} 
                text={item.text} 
                className="h-full border-r border-white/5" 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Visual indicator of continuity */}
      <div className="mt-12 flex justify-center">
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-millions-accent/30 to-transparent"></div>
      </div>
    </div>
  );
};

const ValueCard = ({ name, text, className = "" }: ValueItem & { className?: string }) => (
  <div className={`bg-millions-dark p-10 border-t-2 border-t-transparent hover:border-t-millions-accent hover:bg-millions-accent/5 transition-all duration-300 group ${className}`}>
    <h4 className="font-cormorant text-white text-[1.4rem] font-semibold mb-3 group-hover:text-millions-accent transition-colors">
      {name}
    </h4>
    <p className="text-white/40 text-[0.83rem] leading-[1.8] font-light">
      {text}
    </p>
  </div>
);
