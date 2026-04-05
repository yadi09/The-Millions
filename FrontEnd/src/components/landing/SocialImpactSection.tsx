import React from 'react';

interface Tier {
  badge: string;
  title: string;
  text: string;
}

interface SocialImpactProps {
  content: {
    label: string;
    title: string;
    subTitle: string;
    tiers: Tier[];
    governance: {
      title: string;
      paragraphs: string[];
      list: string[];
      footer: string;
    };
  };
}

export const SocialImpactSection: React.FC<SocialImpactProps> = ({ content }) => {
  const { label, title, subTitle, tiers, governance } = content;

  return (
    <section id="impact" className="bg-millions-dark py-[7rem]">
      <div className="max-w-[1440px] w-[94%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight">
            {title}
          </h2>
          <p className="text-white/50 text-[1.05rem] leading-relaxed font-light mt-4 italic">
            {subTitle}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          {tiers.map((tier, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 p-10 border-t-2 border-t-millions-accent"
            >
              <div className="inline-block bg-millions-accent text-millions-dark text-[0.75rem] tracking-[0.2em] uppercase px-3 py-1 mb-6 font-medium">
                {tier.badge}
              </div>
              <h3 className="font-cormorant text-white text-[1.4rem] font-light mb-4 leading-snug">
                {tier.title}
              </h3>
              <p className="text-white/45 text-[0.95rem] leading-relaxed font-light">
                {tier.text}
              </p>
            </div>
          ))}
        </div>

        {/* Governance Box */}
        <div className="bg-white/5 border border-white/10 p-10 mt-10 animate-fade-in-up md:animation-delay-300">
          <h3 className="font-cormorant text-white text-[1.5rem] font-light mb-6">
            {governance.title}
          </h3>
          <div className="space-y-4 mb-6">
            {governance.paragraphs.map((p, idx) => (
              <p key={idx} className="text-white/45 text-[0.95rem] leading-relaxed font-light">
                {p}
              </p>
            ))}
          </div>
          <ul className="space-y-3 mb-6">
            {governance.list.map((item, idx) => (
              <li key={idx} className="flex gap-3 text-white/45 text-[0.95rem] font-light">
                <span className="text-millions-accent">—</span> {item}
              </li>
            ))}
          </ul>
          <p className="text-white/45 text-[0.95rem] leading-relaxed font-light">
            {governance.footer}
          </p>
        </div>
      </div>
    </section>
  );
};
