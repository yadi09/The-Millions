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
      <section id="contact" className="bg-millions-dark py-[7rem] text-center relative overflow-hidden">
        {/* Background Text Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cormorant text-[6rem] md:text-[15rem] lg:text-[14rem] font-semibold text-white/5 whitespace-nowrap pointer-events-none z-0">
          MILLIONS
        </div>

        <div className="max-w-[720px] w-[94%] mx-auto relative z-10 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 text-millions-accent text-[0.8rem] tracking-[0.22em] uppercase mb-4 sec-label-before">
            {contact.label}
          </div>
          <h2 className="font-cormorant text-white text-4xl md:text-5xl lg:text-[4rem] font-light leading-tight mb-8">
            Ready to Work<br />Together?
          </h2>
          <p className="text-white/55 text-[1.1rem] leading-relaxed font-normal mb-12 max-w-sm mx-auto">
            {contact.subTitle}
          </p>

          <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:gap-x-20 mb-12">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-millions-accent text-[0.8rem] tracking-[0.22em] uppercase font-normal">Phone</span>
              <div className="text-white/55 text-[1.05rem] hover:text-millions-accent transition-colors font-normal flex flex-wrap justify-center gap-x-3">
                {contact.phones.map((phone, idx) => (
                  <a key={idx} href={`tel:${phone}`}>
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-millions-accent text-[0.8rem] tracking-[0.22em] uppercase font-normal">Email</span>
              <a href={`mailto:${contact.email}`} className="text-white/55 text-[1.05rem] hover:text-millions-accent transition-colors font-normal">
                {contact.email}
              </a>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-millions-accent text-[0.8rem] tracking-[0.22em] uppercase font-normal">Website</span>
              <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="text-white/55 text-[1.05rem] hover:text-millions-accent transition-colors font-normal">
                {contact.website}
              </a>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-millions-accent text-[0.8rem] tracking-[0.22em] uppercase font-normal">Address</span>
              <div className="text-white/55 text-[1.05rem] font-normal flex flex-wrap justify-center gap-x-2">
                {contact.address.join(" · ")}
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
        <div className="font-cormorant text-[1.4rem]">
          {footer.logo}
        </div>
        <div className="text-[0.95rem] font-normal">
          {footer.copyright}
        </div>
        <div className="text-[0.95rem] font-normal">
          {footer.location}
        </div>
      </footer>
    </>
  );
};
