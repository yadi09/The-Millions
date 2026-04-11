import React from 'react';

interface SubPageHeroProps {
  label: string;
  title: string;
  subText: string;
}

export const SubPageHero: React.FC<SubPageHeroProps> = ({ label, title, subText }) => {
  return (
    <section className="bg-millions-dark relative pt-32 pb-20 px-4 md:px-20 overflow-hidden">
      {/* Background Gradients (Same as Landing Hero) */}
      <div className="absolute inset-0 hero-bg opacity-60"></div>
      <div className="absolute top-0 right-[20%] w-[1px] h-full hero-gradient-line opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 text-millions-accent text-[0.68rem] tracking-[0.3em] uppercase mb-4 animate-fade-in-up">
          <span className="block w-6 h-[1px] bg-millions-accent"></span>
          {label}
          <span className="block w-6 h-[1px] bg-millions-accent"></span>
        </div>

        <h1 className="font-cormorant text-white text-[clamp(2.5rem,5vw,4rem)] font-light leading-tight mb-6 animate-fade-in-up md:animation-delay-200">
          {title}
        </h1>

        <p className="text-white/50 font-light text-[0.9rem] leading-[1.9] max-w-2xl mx-auto animate-fade-in-up md:animation-delay-300">
          {subText}
        </p>
      </div>
    </section>
  );
};
