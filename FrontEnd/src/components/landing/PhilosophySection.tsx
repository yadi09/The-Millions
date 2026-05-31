import React from 'react';
import { sanitizeHtml } from '../../utils/sanitize';

// Tiptap emits "<p>...</p>" for single-block content. The pull quote is
// rendered inside a <p>, so we strip the leading/trailing <p> tags to avoid
// nesting block elements (which browsers will silently split).
function stripOuterParagraph(html: string): string {
  return html.replace(/^\s*<p[^>]*>/i, '').replace(/<\/p>\s*$/i, '');
}

interface PhilosophyProps {
  content: {
    label?: string;
    title?: string;
    paragraphs?: any[];
    quote?: any; // Changed to any for dynamic objects
    attr?: any;  // Changed to any for dynamic objects
  };
}

export const PhilosophySection: React.FC<PhilosophyProps> = ({ content }) => {
  if (!content) return null;
  const { label = "", title = "", paragraphs = [], quote = "", attr = "" } = content;

  return (
    <section id="philosophy" data-editable-section="philosophy" className="bg-millions-light py-[7rem] px-[5%]">
      <div className="max-w-[1200px] w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* Text Content */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-3 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-[clamp(2rem,4vw,3rem)] font-light leading-tight mb-8">
            {title}
          </h2>
          <div className="space-y-4 text-millions-body text-[0.9rem] leading-[1.9] font-light [&_p]:my-0 [&_strong]:text-millions-dark [&_strong]:font-semibold [&_em]:italic [&_u]:underline">
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

        {/* Quote Box */}
        <div className="animate-fade-in-up md:animation-delay-300">
          <div className="bg-millions-dark p-12 border-t-2 border-t-millions-accent">
            <p
              className="font-cormorant text-white italic text-[1.1rem] leading-[1.7] mb-6 font-light"
              dangerouslySetInnerHTML={{
                __html: `&ldquo;${sanitizeHtml(
                  stripOuterParagraph(
                    typeof quote === 'string' ? quote : (quote?.text || quote?.title || "")
                  )
                )}&rdquo;`
              }}
            />
            <p className="text-millions-accent text-[0.72rem] tracking-[0.15em] uppercase font-light">
              — {typeof attr === 'string' ? attr : (attr?.text || attr?.title || attr?.label || "")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
