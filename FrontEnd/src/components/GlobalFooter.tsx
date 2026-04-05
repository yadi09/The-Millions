import React from 'react';

interface ContactContent {
  label: string;
  title: string;
  subTitle: string;
  phones: string[];
  email: string;
  website: string;
  address: string[];
  buttonText: string;
}

interface FooterContent {
  logo: string;
  copyright: string;
  location: string;
}

interface GlobalFooterProps {
  contact: ContactContent;
  footer: FooterContent;
}

export const GlobalFooter: React.FC<GlobalFooterProps> = ({ contact, footer }) => {
  return (
    <>
      {/* Section 13: Get In Touch */}
      <section id="contact" className="bg-millions-dark py-20 text-center relative overflow-hidden">
        {/* Background Text Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cormorant text-[6rem] md:text-[15rem] lg:text-[14rem] font-semibold text-white/5 whitespace-nowrap pointer-events-none z-0">
          MILLIONS
        </div>

        <div className="max-w-[1000px] w-[94%] mx-auto relative z-10 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 text-millions-accent text-[0.75rem] tracking-[0.22em] uppercase mb-4 sec-label-before">
            {contact.label}
          </div>
          <h2 className="font-cormorant text-white text-4xl md:text-5xl lg:text-[4.5rem] font-light leading-tight mb-8">
            Ready to Work<br />Together?
          </h2>
          <p className="text-white/55 text-[1.05rem] leading-relaxed font-light mb-12 max-w-sm mx-auto">
            {contact.subTitle}
          </p>

          <div className="flex flex-wrap justify-center gap-10 md:gap-14 mb-12">
            <div className="flex flex-col items-center gap-2">
              <span className="text-millions-accent text-[0.75rem] tracking-[0.22em] uppercase font-light">Phone</span>
              <div className="flex flex-col gap-1">
                {contact.phones.map((phone, idx) => (
                  <a key={idx} href={`tel:${phone}`} className="text-white/55 text-[0.95rem] hover:text-millions-accent transition-colors font-light">
                    {phone}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-millions-accent text-[0.75rem] tracking-[0.22em] uppercase font-light">Email</span>
              <a href={`mailto:${contact.email}`} className="text-white/55 text-[0.95rem] hover:text-millions-accent transition-colors font-light">
                {contact.email}
              </a>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-millions-accent text-[0.75rem] tracking-[0.22em] uppercase font-light">Website</span>
              <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="text-white/55 text-[0.95rem] hover:text-millions-accent transition-colors font-light">
                {contact.website}
              </a>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-millions-accent text-[0.75rem] tracking-[0.22em] uppercase font-light">Address</span>
              <div className="flex flex-col gap-1">
                {contact.address.map((line, idx) => (
                  <span key={idx} className="text-white/55 text-[0.95rem] font-light">
                    {line}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <a 
            href={`mailto:${contact.email}`}
            className="inline-block bg-millions-accent text-millions-dark px-10 py-4 font-jost text-[0.85rem] tracking-[0.12em] uppercase font-medium transition-all hover:bg-[#e0bb60] hover:-translate-y-0.5"
          >
            {contact.buttonText}
          </a>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-[#080f0e] py-8 px-4 md:px-20 text-white/25 flex flex-wrap gap-4 items-center justify-between border-t border-white/5">
        <div className="font-cormorant text-lg">
          {footer.logo}
        </div>
        <div className="text-[0.8rem] font-light">
          {footer.copyright}
        </div>
        <div className="text-[0.8rem] font-light">
          {footer.location}
        </div>
      </footer>
    </>
  );
};
