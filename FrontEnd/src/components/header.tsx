import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  const isHome = location.pathname === "/"

  const navigation = [
    { name: "About", href: "/#philosophy" },
    { name: "Services", href: "/#services" },
    { name: "Impact", href: "/#impact" },
    { name: "Leadership", href: "/#leadership" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Blog", href: "/blog" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b border-white/10 ${isScrolled || !isHome || isMenuOpen ? "bg-millions-dark md:bg-millions-dark/95 backdrop-blur-md" : "bg-transparent"
        } py-4 md:py-5 px-[5%] flex items-center justify-between`}>

        {/* Logo */}
        <Link to="/" className="flex flex-col line-none group z-[999]">
          <span className="font-cormorant text-[0.6rem] font-light tracking-[0.25em] text-millions-muted uppercase">the</span>
          <span className="font-cormorant text-[1.5rem] font-semibold text-white group-hover:text-millions-accent transition-colors">MILLIONS.</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex gap-6 list-none">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="text-white/65 hover:text-millions-accent text-[0.75rem] tracking-[0.12em] uppercase transition-colors font-jost"
              >
                {item.name}
              </Link>
            </li>
          ))}
          {/* Contact Link */}
          <li>
            <Link
              to="/contact"
              className="text-white/65 hover:text-millions-accent text-[0.75rem] tracking-[0.12em] uppercase transition-colors font-jost"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Nav CTA / Burger */}
        <div className="flex items-center gap-4">
          <Link
            to="/contact"
            className="hidden lg:block bg-transparent border border-millions-accent text-millions-accent px-[1.3rem] py-[0.5rem] text-[0.72rem] tracking-[0.1em] uppercase hover:bg-millions-accent hover:text-millions-dark transition-all duration-300 font-jost"
          >
            WhatsApp Us
          </Link>

          {/* Burger Button */}
          <button
            className="lg:hidden flex flex-col gap-[5px] p-2 z-[999]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            <span className={`block w-6 h-[2px] bg-white transition-all ${isMenuOpen ? "translate-y-[7px] rotate-45" : ""}`}></span>
            <span className={`block w-6 h-[2px] bg-white transition-all ${isMenuOpen ? "opacity-0 scale-x-0" : ""}`}></span>
            <span className={`block w-6 h-[2px] bg-white transition-all ${isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[997] transition-all duration-500 lg:hidden ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Side Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[280px] bg-millions-dark z-[998] flex flex-col transition-transform duration-500 ease-in-out lg:hidden shadow-2xl ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full pt-24 px-8 pb-12 overflow-y-auto">
          <div className="flex flex-col gap-2 mb-12">
            <span className="font-cormorant text-[0.6rem] font-light tracking-[0.25em] text-millions-muted uppercase">the</span>
            <span className="font-cormorant text-2xl font-semibold text-white">MILLIONS.</span>
          </div>

          <nav className="flex flex-col space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-white/70 hover:text-millions-accent font-cormorant text-xl font-light tracking-widest transition-all py-2 border-b border-white/5"
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="text-white/70 hover:text-millions-accent font-cormorant text-xl font-light tracking-widest transition-all py-2 border-b border-white/5"
            >
              Contact
            </Link>
          </nav>

          <div className="mt-auto pt-10">
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="w-full bg-millions-accent text-millions-dark px-6 py-4 text-[0.75rem] tracking-[0.15em] font-bold uppercase font-jost flex items-center justify-center transition-all hover:bg-white"
            >
              WhatsApp Us
            </Link>
            <p className="mt-6 text-[0.6rem] text-white/20 uppercase tracking-[0.2em] font-light text-center">
              Professional Advisory Sync
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
