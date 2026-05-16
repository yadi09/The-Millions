import React from 'react';

interface HeroProps {
  content: {
    label: string;
    title: string;
    titleEm: string;
    subText: string;
    primaryCta: string;
    ghostCta: string;
    stats: Array<{ num: string; label: string }>;
  };
}

export const HeroSection: React.FC<HeroProps> = ({ content }) => {
  // Defensive check for missing content
  if (!content) return null;

  const { label = "", title = "", titleEm = "", subText = "", primaryCta = "", ghostCta = "", stats = [] } = content;

  // Splitting title to italicize the "titleEm" portion if it matches
  const titleParts = titleEm ? title.split(titleEm) : [title, ""];

  return (
    <section id="hero" className="bg-millions-dark relative overflow-hidden pt-[7rem] px-[5%] pb-[10rem]">
      {/* Dynamic Backgrounds */}
      <div className="absolute inset-0 hero-bg"></div>
      <div className="absolute top-0 right-[15%] w-[1px] h-full hero-gradient-line"></div>
      <div className="absolute top-0 right-[35%] w-[1px] h-full hero-gradient-line opacity-40"></div>

      <div className="relative z-10 max-w-[1100px] w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Left Content */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 text-millions-accent text-[0.8rem] tracking-[0.3em] uppercase mb-6">
            <span className="block w-10 h-[1px] bg-millions-accent"></span>
            {label}
          </div>
          
          <h1 className="font-cormorant text-white text-[clamp(3rem,6vw,5.2rem)] font-light leading-[1.02] mb-8">
            {titleParts[0]}
            <br />
            <em className="italic text-millions-accent not-italic font-light">{titleEm}</em>
          </h1>

          <p className="text-white/50 font-light text-[0.88rem] leading-[1.8] max-w-md mb-10">
            {subText}
          </p>

          <div className="flex flex-wrap gap-6 items-center">
            <a 
              href="#services" 
              className="bg-millions-accent text-millions-dark px-10 py-4 font-jost text-[0.78rem] tracking-[0.12em] uppercase font-medium transition-all hover:bg-[#e0bb60] hover:-translate-y-0.5"
            >
              {primaryCta}
            </a>
            <a 
              href="#philosophy" 
              className="text-white/55 hover:text-white flex items-center gap-2 font-jost text-[0.78rem] tracking-[0.12em] uppercase transition-colors group"
            >
              {ghostCta}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>

        {/* Right Stats */}
        <div className="flex flex-col gap-6">
          {stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 border border-white/10 p-8 border-l-2 border-l-millions-accent stat-card-anim"
              style={{ animationDelay: `${0.3 + idx * 0.2}s` }}
            >
              <div className="font-cormorant text-millions-accent text-4xl font-light">
                {stat.num}
              </div>
              <div className="text-white/40 text-[0.72rem] tracking-[0.1em] uppercase mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
