import React from 'react';

interface ValuesProps {
  content: {
    label?: string;
    title?: string;
    values?: any[];
    items?: any[]; // Fallback for static data mismatch
  };
}

export const ValuesSection: React.FC<ValuesProps> = ({ content }) => {
  if (!content) return null;
  const { label = "", title = "", values: rawValues = [], items = [] } = content;
  const values = rawValues.length > 0 ? rawValues : items;

  const renderText = (item: any, field: 'text' | 'name' | 'title' = 'text') => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item[field] || item.text || item.title || item.name || "";
    }
    return "";
  };

  return (
    <section id="values" className="bg-millions-dark py-[7rem] px-[5%] overflow-hidden">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="animate-fade-in-up mb-16">
          <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-white/10 border border-white/10">
          {(values || []).map((value, idx) => (
            <div 
              key={idx} 
              className="bg-millions-dark p-10 hover:bg-white/5 transition-all duration-300 group"
            >
              <div className="text-millions-accent/20 font-cormorant text-4xl mb-6 group-hover:text-millions-accent transition-colors">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>
              <h3 className="font-cormorant text-white text-[1.4rem] font-light mb-4 italic">
                {renderText(value, 'name')}
              </h3>
              <p className="text-white/45 text-[0.83rem] leading-[1.8] font-light">
                {renderText(value, 'text')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
