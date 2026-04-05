import React from 'react';

interface Leader {
  name: string;
  creds: string;
  role: string;
  initials: string;
}

interface LeadershipProps {
  content: {
    label: string;
    title: string;
    subTitle: string;
    commitments: string[];
    leaders: Leader[];
  };
}

export const LeadershipSection: React.FC<LeadershipProps> = ({ content }) => {
  const { label, title, subTitle, commitments, leaders } = content;

  return (
    <section id="leadership" className="bg-millions-light py-[7rem]">
      <div className="max-w-[1440px] w-[94%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-millions-dark text-4xl md:text-5xl lg:text-[3.5rem] font-light leading-tight mb-6">
            {title}
          </h2>
          <p className="text-millions-body text-[1.05rem] leading-relaxed font-light mb-8 lg:max-w-md">
            {subTitle}
          </p>
          <ul className="space-y-4">
            {commitments.map((item, idx) => (
              <li key={idx} className="flex gap-4 p-4 border-b border-millions-dark/5 text-millions-body text-[0.95rem] leading-relaxed font-light">
                <span className="text-millions-accent flex-shrink-0">—</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-in-up md:animation-delay-300">
          <div className="flex flex-col gap-6">
            {leaders.map((leader, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-6 bg-white p-6 border-l-2 border-l-transparent hover:border-l-millions-accent hover:shadow-[0_8px_24px_rgba(13,36,32,0.07)] transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-millions-mid flex items-center justify-center font-cormorant text-2xl text-millions-accent flex-shrink-0">
                  {leader.initials}
                </div>
                <div>
                  <h3 className="font-cormorant text-millions-dark text-[1.3rem] font-semibold">
                    {leader.name}
                  </h3>
                  <p className="text-millions-accent text-[0.8rem] tracking-wider mb-1">
                    {leader.creds || '\u00A0'}
                  </p>
                  <p className="text-millions-muted text-[0.8rem] tracking-widest uppercase font-light">
                    {leader.role}
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
