import React from 'react';
import { sanitizeHtml } from '../../utils/sanitize';

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
    <section id="mission" data-editable-section="mission-vision" className="bg-millions-light py-[7rem] px-[5%]">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="animate-fade-in-up mb-12">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.25em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
            {title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] animate-fade-in-up md:animation-delay-300">
          {/* Mission Card */}
          <div className="bg-millions-dark p-12 border-t-2 border-t-millions-accent">
            <div className="text-millions-accent text-[0.75rem] tracking-[0.25em] uppercase mb-4 font-light">
              {typeof mission === 'string' ? 'Our Mission' : (mission as any)?.label || 'Our Mission'}
            </div>
            <h3 className="font-cormorant text-white text-[1.6rem] font-light mb-4 leading-snug">
              {typeof mission === 'string' ? mission : (mission as any)?.title || "Trusted Advisory. Accredited Learning."}
            </h3>
            <div
              className="text-white/55 text-[0.9rem] leading-[1.9] font-light [&_p]:my-0 [&_strong]:text-white [&_strong]:font-medium [&_em]:italic [&_u]:underline"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  typeof mission === 'string' ? mission : ((mission as any)?.text || "")
                )
              }}
            />
          </div>

          {/* Vision Card */}
          <div className="bg-white p-12 border-t-2 border-t-millions-mid">
            <div className="text-millions-mid text-[0.75rem] tracking-[0.25em] uppercase mb-4 font-light">
              {typeof vision === 'string' ? 'Our Vision' : (vision as any)?.label || 'Our Vision'}
            </div>
            <h3 className="font-cormorant text-millions-dark text-[1.6rem] font-light mb-4 leading-snug">
              {typeof vision === 'string' ? vision : (vision as any)?.title || "A Global Professional Platform."}
            </h3>
            <div
              className="text-millions-body text-[0.9rem] leading-[1.9] font-light [&_p]:my-0 [&_strong]:text-millions-dark [&_strong]:font-medium [&_em]:italic [&_u]:underline"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(
                  typeof vision === 'string' ? vision : ((vision as any)?.text || "")
                )
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
