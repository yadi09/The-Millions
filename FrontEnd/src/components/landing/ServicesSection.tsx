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

  return (
    <section id="services" className="bg-millions-mid py-[7rem]">
      <div className="max-w-[1440px] w-[94%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 p-10 border-t-2 border-t-transparent hover:border-t-millions-accent hover:bg-white/10 transition-all duration-350"
            >
              <h3 className="font-cormorant text-white text-[1.5rem] font-light mb-4">
                {item.title}
              </h3>
              <p className="text-white/45 text-[0.95rem] leading-relaxed font-light">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Integrated Banner */}
        <div className="bg-millions-accent/10 border-l-4 border-l-millions-accent p-8 md:p-10 mt-8 animate-fade-in-up md:animation-delay-300">
          <h3 className="font-cormorant text-millions-accent text-[1.4rem] md:text-[1.6rem] font-light mb-3">
            {footer.title}
          </h3>
          <p className="text-white/50 text-[0.95rem] leading-relaxed font-light">
            {footer.text}
          </p>
        </div>
      </div>
    </section>
  );
};
