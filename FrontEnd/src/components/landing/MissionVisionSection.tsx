import React from 'react';

interface MissionVisionProps {
  content: {
    label: string;
    title: string;
    mission: { label: string; title: string; text: string };
    vision: { label: string; title: string; text: string };
  };
}

export const MissionVisionSection: React.FC<MissionVisionProps> = ({ content }) => {
  const { label, title, mission, vision } = content;

  return (
    <section id="mission" className="bg-millions-light py-[7rem]">
      <div className="max-w-[1440px] w-[94%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.25em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 animate-fade-in-up md:animation-delay-300">
          {/* Mission Card */}
          <div className="bg-millions-dark p-12 border-t-2 border-t-millions-accent">
            <div className="text-millions-accent text-[0.75rem] tracking-[0.25em] uppercase mb-4 font-light">
              {mission.label}
            </div>
            <h3 className="font-cormorant text-white text-[1.8rem] font-light mb-4 leading-snug">
              {mission.title}
            </h3>
            <p className="text-white/55 text-[1.05rem] leading-relaxed font-light">
              {mission.text}
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-12 border-t-2 border-t-millions-mid">
            <div className="text-millions-mid text-[0.75rem] tracking-[0.25em] uppercase mb-4 font-light">
              {vision.label}
            </div>
            <h3 className="font-cormorant text-millions-dark text-[1.8rem] font-light mb-4 leading-snug">
              {vision.title}
            </h3>
            <p className="text-millions-body text-[1.05rem] leading-relaxed font-light">
              {vision.text}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
