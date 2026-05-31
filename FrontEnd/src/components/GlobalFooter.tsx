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
      <section id="contact" data-editable-section="global-footer" className="bg-millions-dark py-[7rem] text-center relative overflow-hidden">
        {/* Background Text Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-cormorant text-[clamp(6rem,15vw,14rem)] font-semibold text-white/5 whitespace-nowrap pointer-events-none z-0">
          MILLIONS
        </div>

        <div className="max-w-[720px] w-[94%] mx-auto relative z-10 animate-fade-in-up">
          <div className="flex items-center justify-center gap-4 text-millions-accent text-[0.8rem] tracking-[0.22em] uppercase mb-4 sec-label-before">
            {contact.label}
          </div>
          <h2 className="font-cormorant text-white text-[clamp(2rem,4vw,3rem)] font-light leading-tight mb-8">
            Ready to Work<br />Together?
          </h2>
          <p className="text-white/55 text-[0.85rem] leading-[1.8] font-normal mb-12 max-w-sm mx-auto">
            {contact.subTitle}
          </p>

          <div className="grid grid-cols-2 gap-y-12 gap-x-8 md:gap-x-20 mb-12">
            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-millions-accent text-[0.63rem] tracking-[0.22em] uppercase font-normal">Phone</span>
              <div className="text-white/55 text-[0.85rem] hover:text-millions-accent transition-colors font-normal flex flex-wrap justify-center gap-x-3">
                {contact.phones.map((phone, idx) => (
                  <a key={idx} href={`tel:${phone}`}>
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-millions-accent text-[0.63rem] tracking-[0.22em] uppercase font-normal">Email</span>
              <a href={`mailto:${contact.email}`} className="text-white/55 text-[0.85rem] hover:text-millions-accent transition-colors font-normal">
                {contact.email}
              </a>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-millions-accent text-[0.63rem] tracking-[0.22em] uppercase font-normal">Website</span>
              <a href={`https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="text-white/55 text-[0.85rem] hover:text-millions-accent transition-colors font-normal">
                {contact.website}
              </a>
            </div>

            <div className="flex flex-col items-center gap-1.5 text-center">
              <span className="text-millions-accent text-[0.63rem] tracking-[0.22em] uppercase font-normal">Address</span>
              <div className="text-white/55 text-[0.85rem] font-normal flex flex-wrap justify-center gap-x-2">
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
      <footer data-editable-section="global-footer" className="bg-[#080f0e] py-[1.8rem] px-[5%] text-white/25 flex flex-wrap gap-4 items-center justify-between border-t border-white/5">
        <div className="font-cormorant text-[1rem]">
          {footer.logo === '/logo.svg' ? 'the MILLIONS.' : footer.logo}
        </div>
        <div className="text-[0.7rem] font-light text-white/20 text-center flex-1 md:flex-none">
          {footer.copyright?.includes('©') ? '' : `© ${new Date().getFullYear()} `}{footer.copyright}
        </div>
        <div className="text-[0.7rem] font-light text-white/20 uppercase tracking-[0.15em]">
          {footer.location}
        </div>
      </footer>
    </>
  );
};
