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

  // Split items into two rows based on the specific design proportions
  const row1 = items.slice(0, 4);
  const row2 = items.slice(4, 7);

  return (
    <section id="values" className="bg-millions-dark py-[7rem]">
      <div className="max-w-[1440px] w-[94%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight">
            {title}
          </h2>
          <p className="text-white/50 text-[1.05rem] leading-relaxed font-light mt-2 italic">
            {subTitle}
          </p>
        </div>

        {/* Row 1: 4-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/5 animate-fade-in-up md:animation-delay-300">
          {row1.map((item, idx) => (
            <ValueCard key={idx} name={item.name} text={item.text} />
          ))}
        </div>

        {/* Row 2: Custom grid 2fr 1fr 1fr */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-[1px] bg-white/5 mt-[1px] animate-fade-in-up md:animation-delay-500">
          {row2.map((item, idx) => (
            <ValueCard key={idx} name={item.name} text={item.text} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ValueCard = ({ name, text }: ValueItem) => (
  <div className="bg-millions-dark p-10 border-t-2 border-t-transparent hover:border-t-millions-accent hover:bg-millions-accent/5 transition-all duration-300 group">
    <h4 className="font-cormorant text-white text-[1.4rem] font-semibold mb-3 group-hover:text-millions-accent transition-colors">
      {name}
    </h4>
    <p className="text-white/40 text-[0.95rem] leading-relaxed font-light">
      {text}
    </p>
  </div>
);
