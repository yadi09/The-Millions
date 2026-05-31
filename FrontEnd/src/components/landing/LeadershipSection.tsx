import React from 'react';
import { sanitizeHtml } from '../../utils/sanitize';

interface Leader {
  name: string;
  creds: string;
  role: string;
  initials: string;
  image?: string;
}

interface LeadershipProps {
  content: {
    label?: string;
    title?: string;
    subTitle?: string;
    commitments?: any[];
    leaders?: Leader[];
  };
}

export const LeadershipSection: React.FC<LeadershipProps> = ({ content }) => {
  if (!content) return null;
  const { label = "", title = "", subTitle = "", commitments = [], leaders = [] } = content;

  return (
    <section id="leadership" data-editable-section="leadership" className="bg-millions-light py-[7rem] px-[5%]">
      <div className="max-w-[1200px] w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-[clamp(2rem,4vw,3rem)] font-light leading-tight mb-6">
            {title}
          </h2>
          <div
            className="text-millions-body text-[0.9rem] leading-[1.9] font-medium mb-8 lg:max-w-md [&_p]:my-0 [&_strong]:text-millions-dark [&_strong]:font-semibold [&_em]:italic [&_u]:underline"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(subTitle) }}
          />
          <ul className="space-y-1">
            {(commitments || []).map((item, idx) => (
              <li key={idx} className="flex gap-4 p-2 border-b border-millions-dark/5 text-millions-body text-[0.85rem] leading-[1.8] font-medium">
                <span className="text-millions-accent flex-shrink-0">—</span>
                {typeof item === 'string' ? item : (item?.text || item?.title || item?.label || "")}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-in-up md:animation-delay-300">
          <div className="flex flex-col gap-6 mt-4">
            {(leaders || []).map((leader, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 bg-white p-6 border-l-2 border-l-transparent hover:border-l-millions-accent hover:shadow-[0_8px_24px_rgba(13,36,32,0.07)] transition-all duration-300 group"
              >
                {leader?.image ? (
                  <img
                    src={leader.image}
                    alt={leader?.name || ''}
                    className="w-14 h-14 object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 bg-millions-mid flex items-center justify-center font-cormorant text-2xl text-millions-accent flex-shrink-0">
                    {leader?.initials}
                  </div>
                )}
                <div>
                  <h3 className="font-cormorant text-millions-dark text-[1.1rem] font-semibold">
                    {leader?.name}
                  </h3>
                  <p className="text-millions-accent text-[0.8rem] tracking-wider mb-1">
                    {leader?.creds || '\u00A0'}
                  </p>
                  <p className="text-millions-muted text-[0.8rem] tracking-widest uppercase font-light">
                    {leader?.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
