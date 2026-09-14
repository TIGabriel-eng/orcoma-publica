import React, { useState, useEffect } from 'react';
import { OrcomaLogo } from './OrcomaLogo';

interface HeaderProps {
  onOpenContactModal?: () => void;
  onOpenAreaCliente?: () => void;
  onOpenBlog?: () => void;
  onOpenHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenContactModal,
  onOpenAreaCliente,
  onOpenBlog,
  onOpenHome,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#inicio', home: true },
    { name: 'Diferenciais', href: '#diferenciais' },
    { name: 'Sobre', href: '#sobre' },
    { name: 'Soluções', href: '#contabilidade-publica' },
    { name: 'Blog', href: '', action: true },
  ];

  return (
    <header
      id="main-header"
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[linear-gradient(160deg,rgb(12,12,204)_0%,rgb(26,26,255)_50%,rgb(0,0,179)_100%)]/95 backdrop-blur-md shadow-lg border-b border-white/15'
          : 'bg-[linear-gradient(160deg,rgb(12,12,204)_0%,rgb(26,26,255)_50%,rgb(0,0,179)_100%)] border-b border-white/15 shadow-md'
      }`}
    >
      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Replacement */}
          <button
            type="button"
            id="brand-logo"
            onClick={onOpenHome}
            className="flex items-center gap-2 group text-decoration-none py-1 cursor-pointer"
          >
            <OrcomaLogo variant="light" size="md" />
          </button>

          {/* Desktop Navigation in Light Blue Pill */}
          <nav className="hidden lg:flex items-center bg-[#E0F2FE] p-1.5 rounded-full border border-sky-200/90 shadow-sm">
            {navLinks.map((link) =>
              link.action ? (
                <button
                  key={link.name}
                  type="button"
                  onClick={onOpenBlog}
                  className="px-4 py-1.5 rounded-full text-xs xl:text-sm font-bold text-[#0c0ccc] hover:bg-white hover:text-[#0c0ccc] hover:shadow-sm transition-all duration-200 whitespace-nowrap"
                >
                  {link.name}
                </button>
              ) : link.home ? (
                <button
                  key={link.name}
                  type="button"
                  onClick={onOpenHome}
                  className="px-4 py-1.5 rounded-full text-xs xl:text-sm font-bold text-[#0c0ccc] hover:bg-white hover:text-[#0c0ccc] hover:shadow-sm transition-all duration-200 whitespace-nowrap"
                >
                  {link.name}
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-4 py-1.5 rounded-full text-xs xl:text-sm font-bold text-[#0c0ccc] hover:bg-white hover:text-[#0c0ccc] hover:shadow-sm transition-all duration-200 whitespace-nowrap"
                >
                  {link.name}
                </a>
              )
            )}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              type="button"
              onClick={onOpenContactModal}
              className="border border-yellow-400/90 text-yellow-400 hover:bg-yellow-400 hover:text-[#0c0ccc] px-4 py-2 rounded-full font-bold transition-all uppercase text-xs tracking-wider shadow-sm"
            >
              <i className="fa-solid fa-comments mr-1.5 text-[10px]"></i>
              Fale Conosco
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-blue-100 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
              aria-expanded={mobileMenuOpen}
              aria-label="Abrir menu principal"
            >
              {mobileMenuOpen ? (
                <i className="fa-solid fa-xmark text-2xl"></i>
              ) : (
                <i className="fa-solid fa-bars text-2xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050550] border-b border-white/15 px-4 pt-4 pb-6 space-y-4 animate-fadeIn">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) =>
              link.action ? (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenBlog?.();
                  }}
                  className="px-4 py-2.5 rounded-full text-sm font-bold text-[#0c0ccc] bg-[#E0F2FE] hover:bg-white text-center transition-all shadow-sm"
                >
                  {link.name}
                </button>
              ) : link.home ? (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenHome?.();
                  }}
                  className="px-4 py-2.5 rounded-full text-sm font-bold text-[#0c0ccc] bg-[#E0F2FE] hover:bg-white text-center transition-all shadow-sm"
                >
                  {link.name}
                </button>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-full text-sm font-bold text-[#0c0ccc] bg-[#E0F2FE] hover:bg-white text-center transition-all shadow-sm"
                >
                  {link.name}
                </a>
              )
            )}
          </div>
          <div className="pt-3 border-t border-white/10 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContactModal?.();
              }}
              className="w-full flex items-center justify-center px-4 py-2.5 text-xs font-bold text-yellow-400 border border-yellow-400 rounded-md uppercase tracking-wider"
            >
              <i className="fa-solid fa-comments mr-2"></i>
              Fale Conosco
            </button>
            <div className="mt-4 flex justify-center space-x-6 text-blue-200/80 text-xs pt-2">
              <a href="tel:+557532512400" className="flex items-center hover:text-yellow-400">
                <i className="fa-solid fa-phone mr-1.5 text-xs"></i> (75) 3251-2400
              </a>
              <a href="mailto:contato@orcoma.com.br" className="flex items-center hover:text-yellow-400">
                <i className="fa-regular fa-envelope mr-1.5 text-xs"></i> E-mail
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

