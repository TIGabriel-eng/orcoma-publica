import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Reveal } from './Reveal';

export const ContabilidadePublica: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['-60%', '60%']);

  return (
    <section
      id="contabilidade-publica"
      ref={containerRef}
      className="py-40 lg:py-56 bg-white relative overflow-hidden scroll-mt-20"
    >
      {/* Fundo com imagem + efeito parallax */}
      <motion.div
        className="absolute inset-x-0 top-2/5 -translate-y-1/2 h-[160%] z-0 pointer-events-none"
        style={{ y: bgY }}
      >
        <img
          src="/orcoma_contabilidade_cover.jpg"
          alt=""
          className="w-full h-full object-cover scale-x-[1.1]"
        />
      </motion.div>

      {/* Overlay azul translúcido para legibilidade do texto */}
      <div className="absolute inset-0 z-0 bg-[#0c0ccc]/5 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6 sm:space-y-8">

          {/* Main Headline */}
          <Reveal delay={0}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight sm:leading-snug">
              Contabilidade pública ágil e transparente em{' '}
              <span className="text-yellow-400 uppercase">
                Itaberaba - BA!
              </span>
            </h2>
          </Reveal>

          {/* Description */}
          <Reveal delay={0.15}>
            <p className="text-blue-100 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto font-normal">
              Transforme sua gestão pública com soluções contábeis ágeis que garantem a eficiência fiscal e transparência necessárias para o sucesso de sua administração. Não deixe que a burocracia atrapalhe a evolução do seu órgão público.
            </p>
          </Reveal>

          {/* CTA Button */}
          <Reveal delay={0.3}>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contato"
              id="cta-contabilidade-publica"
              className="w-full sm:w-auto inline-flex items-center justify-center px-9 py-4 text-sm sm:text-base font-extrabold text-[#0c0ccc] bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-xl hover:shadow-yellow-400/30 transition-all duration-200 transform hover:-translate-y-0.5 uppercase tracking-wider gap-3 group"
            >
              <span>Quero contar com a Orcoma</span>
              <i className="fa-solid fa-arrow-right text-base text-[#0c0ccc] group-hover:translate-x-1 transition-transform"></i>
            </a>

            <a
              href="https://wa.me/5575999882400?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20as%20solu%C3%A7%C3%B5es%20de%20contabilidade%20p%C3%BAblica%20da%20Orcoma%20em%20Itaberaba."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 hover:border-yellow-400 rounded-full transition-all duration-200 uppercase tracking-wider backdrop-blur-sm gap-2"
            >
              <i className="fa-brands fa-whatsapp text-lg text-yellow-400"></i>
              <span>Falar via WhatsApp</span>
            </a>
          </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};
