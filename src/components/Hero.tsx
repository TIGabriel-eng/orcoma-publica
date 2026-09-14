import React from 'react';
import { Reveal } from './Reveal';

interface HeroProps {
  onSelectSector?: (sector: 'publico' | 'privado' | 'terceiro-setor' | 'saude') => void;
}

export const Hero: React.FC<HeroProps> = ({ onSelectSector }) => {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-[linear-gradient(160deg,rgb(12,12,204)_0%,rgb(26,26,255)_50%,rgb(0,0,179)_100%)] text-white pt-12 pb-24 sm:pb-28 lg:pt-16 lg:pb-36"
    >
      {/* Background Decorative Tech Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-yellow-400/15 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="space-y-6 sm:space-y-8">
          
          {/* Impactful Title */}
          <Reveal animate delay={0.15} y={25}>
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                Garanta transparência e{' '}
                <span className="text-yellow-400 block sm:inline">
                  eficiência pública!
                </span>
              </h1>
            </div>
          </Reveal>

          {/* Supporting Copy */}
          <Reveal animate delay={0.35} y={25}>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-normal">
              Tenha registros, controles, geração de demonstrativos orçamentários e todo o suporte relacionado às atividades da administração pública, tudo isso feito por profissionais que realmente podem assegurar a proteção das suas atividades nos órgãos públicos.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal animate delay={0.55} y={25}>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contato"
                id="hero-cta-primary"
                className="inline-flex items-center justify-center px-8 py-4 text-sm font-extrabold text-[#0c0ccc] bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-xl hover:shadow-yellow-400/35 transition-all duration-200 transform hover:-translate-y-0.5 uppercase tracking-wider"
              >
                <i className="fa-solid fa-comments mr-2.5 text-base"></i>
                Falar com um Contador
              </a>
              <a
                href="#diferenciais"
                id="hero-cta-secondary"
                className="inline-flex items-center justify-center px-7 py-4 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 hover:border-yellow-400 rounded-full transition-all duration-200 uppercase tracking-wider backdrop-blur-sm"
              >
                <i className="fa-solid fa-arrow-down mr-2 text-yellow-400"></i>
                Saiba Mais
              </a>
            </div>
          </Reveal>

        </div>
      </div>

      {/* Curved Shape Divider at the Bottom of Hero (Inverted U arch / Dome: ∩) */}
      <div
        className="absolute -bottom-[1px] left-0 w-full overflow-hidden leading-none z-20 pointer-events-none"
      >
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[45px] sm:h-[65px] lg:h-[90px]"
        >
          <path
            d="M600,7.23C268.63,7.23,0,54.48,0,112.77V120H1200V112.77C1200,54.48,931.37,7.23,600,7.23Z"
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>
    </section>
  );
};
