import React from 'react';

interface MissionVisionProps {
  content: {
    label?: string;
    title?: string;
    mission?: any;
    vision?: any;
  };
}

export const MissionVisionSection: React.FC<MissionVisionProps> = ({ content }) => {
  if (!content) return null;
  const { label = "", title = "", mission = "", vision = "" } = content;

  return (
    <section id="vision" className="bg-millions-light py-[7rem] px-[5%] overflow-hidden">
      <div className="max-w-[1200px] w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 items-center">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-[clamp(2.4rem,5vw,3.8rem)] font-light leading-none mb-10">
            {title}
          </h2>
          
          <div className="space-y-12">
            <div className="relative pl-10 border-l border-millions-dark/10">
              <span className="absolute -left-[1px] top-0 w-[2px] h-10 bg-millions-accent"></span>
              <h3 className="font-cormorant text-millions-dark text-[1.4rem] font-light mb-3 italic">Our Mission</h3>
              <p className="text-millions-body text-[0.9rem] leading-[1.8] font-light">
                {typeof mission === 'string' ? mission : (mission as any)?.text}
              </p>
            </div>
            <div className="relative pl-10 border-l border-millions-dark/10">
              <span className="absolute -left-[1px] top-0 w-[2px] h-10 bg-millions-accent"></span>
              <h3 className="font-cormorant text-millions-dark text-[1.4rem] font-light mb-3 italic">Our Vision</h3>
              <p className="text-millions-body text-[0.9rem] leading-[1.8] font-light">
                {typeof vision === 'string' ? vision : (vision as any)?.text}
              </p>
            </div>
          </div>
        </div>

        <div className="relative aspect-square animate-fade-in-up md:animation-delay-300">
          <div className="absolute inset-0 bg-millions-dark/5 border border-millions-dark/10"></div>
          <div className="absolute inset-10 border border-millions-accent/20 flex items-center justify-center">
            <div className="w-20 h-20 border border-millions-accent/40 flex items-center justify-center font-cormorant text-3xl text-millions-accent/60">
              M
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
