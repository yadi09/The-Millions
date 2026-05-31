import React from 'react';
import { sanitizeHtml } from '../../utils/sanitize';

interface OverviewProps {
  content: {
    label?: string;
    title?: string;
    paragraphs?: any[];
  };
}

export const OverviewSection: React.FC<OverviewProps> = ({ content }) => {
  if (!content) return null;
  const { label = "", title = "", paragraphs = [] } = content;

  return (
    <section id="overview" data-editable-section="overview" className="bg-millions-mid py-[7rem] px-[5%]">
      <div className="max-w-[1200px] w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-3 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-[clamp(2rem,4vw,3rem)] font-light leading-tight">
            {title}
          </h2>
        </div>
        <div className="animate-fade-in-up md:animation-delay-300">
          <div className="space-y-6 text-white/55 text-[0.9rem] leading-[1.9] font-light [&_p]:my-0 [&_strong]:text-white [&_strong]:font-medium [&_em]:italic [&_u]:underline">
            {(paragraphs || []).map((p, idx) => {
              const html = typeof p === 'string' ? p : (p?.text || p?.title || p?.label || "");
              return (
                <div
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
