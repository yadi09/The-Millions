import React from 'react';

interface FutureVisionProps {
  content: {
    label?: string;
    title?: string;
    subTitle?: string;
    goals?: any[];
    points?: any[]; // Fallback for static data mismatch
  };
}

export const FutureVisionSection: React.FC<FutureVisionProps> = ({ content }) => {
  if (!content) return null;
  const { label = "", title = "", subTitle = "", goals: rawGoals = [], points = [] } = content;
  const goals = rawGoals.length > 0 ? rawGoals : points;

  const renderText = (item: any) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item !== null) {
      return item.text || item.title || item.label || "";
    }
    return "";
  };

  return (
    <section id="future" className="bg-millions-mid py-[7rem] px-[5%]">
      <div className="max-w-[1200px] w-[90%] mx-auto">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 sec-label-before">
            {label}
          </div>
          <h2 className="font-cormorant text-white text-[clamp(2.4rem,5vw,3.8rem)] font-light leading-tight mb-6">
            {title}
          </h2>
          <p className="text-white/55 text-[0.95rem] leading-[1.8] font-light max-w-2xl mx-auto italic">
            {subTitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {(goals || []).map((goal, idx) => (
            <div 
              key={idx} 
              className="bg-millions-dark/30 p-10 border border-white/5 hover:border-millions-accent/30 transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${0.2 * idx}s` }}
            >
              <div className="w-12 h-[1px] bg-millions-accent mb-8 group-hover:w-20 transition-all duration-500"></div>
              <p className="text-white/70 text-[0.9rem] leading-[1.9] font-light">
                {renderText(goal)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
