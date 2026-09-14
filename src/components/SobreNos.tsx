import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { GeometricGlowBackground } from './GeometricGlowBackground';

interface CardConfig {
  id: string;
  step: string;
  title: string;
  description: string;
  icon: string;
  cardBg: string;
  textColor: string;
  descColor: string;
  titleColor: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const SobreNos: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Efeito suave de espalhamento e recolhimento no scroll
  const card1Y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [30, 0, 0, -20]);
  const card2Y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [60, 0, 5, -40]);
  const card3Y = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [90, 0, 10, -60]);

  const cards: CardConfig[] = [
    {
      id: 'qualidade',
      step: '1º',
      title: 'Qualidade nos serviços',
      description:
        'Com uma política empresarial totalmente voltada para a qualidade dos serviços.',
      icon: 'fa-solid fa-award',
      cardBg: 'bg-white',
      titleColor: 'text-[#0c0ccc]',
      textColor: 'text-[#0c0ccc]',
      descColor: 'text-[#0c0ccc]/85 font-medium',
      iconBg: 'bg-[#0c0ccc]',
      iconColor: 'text-white',
      badgeBg: 'bg-[#0c0ccc]/10',
      badgeText: 'text-[#0c0ccc]',
      borderColor: 'border-white/90',
    },
    {
      id: 'especializacao',
      step: '2º',
      title: 'Especialização pública',
      description:
        'Somos especialistas na contabilidade pública para melhor te atender.',
      icon: 'fa-solid fa-landmark-dome',
      cardBg: 'bg-[#0c0ccc]',
      titleColor: 'text-white',
      textColor: 'text-white',
      descColor: 'text-white/90 font-normal',
      iconBg: 'bg-yellow-400',
      iconColor: 'text-black',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      borderColor: 'border-white/30',
    },
    {
      id: 'experiencia',
      step: '3º',
      title: 'Tempo de experiência',
      description:
        'Com mais de 35 anos no mercado, temos a solução de que você precisa',
      icon: 'fa-solid fa-clock-rotate-left',
      cardBg: 'bg-yellow-400',
      titleColor: 'text-black',
      textColor: 'text-black',
      descColor: 'text-black font-semibold',
      iconBg: 'bg-[#0c0ccc]',
      iconColor: 'text-white',
      badgeBg: 'bg-black/10',
      badgeText: 'text-black',
      borderColor: 'border-yellow-300',
    },
  ];

  const cardTransforms = [card1Y, card2Y, card3Y];

  return (
    <section
      id="sobre"
      ref={containerRef}
      className="pt-28 pb-28 lg:pt-36 lg:pb-36 bg-[#07073b] relative overflow-hidden text-white"
    >
      {/* Wave Divider Superior (Transição Diferenciais -> Sobre Nós) */}
      <div
        className="absolute -top-[1px] left-0 w-full overflow-hidden leading-none z-20 pointer-events-none"
        style={{ transform: 'rotate(180deg)' }}
      >
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[50px] sm:h-[80px] lg:h-[110px]"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>

      {/* Wave Divider Inferior (Transição Sobre Nós -> Próxima Seção Branca) */}
      <div
        className="absolute -bottom-[1px] left-0 w-full overflow-hidden leading-none z-20 pointer-events-none"
      >
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[50px] sm:h-[80px] lg:h-[110px]"
        >
          <path
            d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>

      {/* Background Geometric Triangle Grid + Dynamic Gold Glow Effect */}
      <GeometricGlowBackground baseColor="#07073b" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Coluna Esquerda: Textos em Branco, Título em Amarelo, Botão WhatsApp */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-yellow-400 tracking-tight leading-tight">
                Sobre Nós
              </h2>
            </div>

            <p className="text-white text-base sm:text-lg lg:text-xl leading-relaxed font-normal max-w-xl">
              Com mais de 35 anos de experiência, somos especialistas na contabilidade pública em Itaberaba. Oferecemos soluções inovadoras e estratégicas, garantindo que sua administração pública atenda a todas as exigências legais e fiscais, com ética e transparência.
            </p>

            <div className="pt-3">
              <style>{`
                @keyframes float {
                  0%, 100% { transform: translateY(0px); box-shadow: 0 4px 15px rgba(250, 204, 21, 0.3); }
                  50% { transform: translateY(-12px); box-shadow: 0 8px 25px rgba(250, 204, 21, 0.5); }
                }
                .btn-float { animation: float 1.8s ease-in-out infinite; }
              `}</style>
              <a
                href="https://wa.me/5575999882400?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20cont%C3%A1beis%20do%20Grupo%20Orcoma."
                target="_blank"
                rel="noopener noreferrer"
                className="btn-float inline-flex items-center justify-center px-8 py-4 text-sm font-extrabold text-white bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg hover:shadow-yellow-400/30 transition-all duration-200 uppercase tracking-wider gap-3 group"
              >
                <i className="fa-brands fa-whatsapp text-2xl text-white group-hover:scale-110 transition-transform"></i>
                <span className="text-white">Entre em contato conosco</span>
              </a>
            </div>
          </div>

          {/* Coluna Direita: 3 Cards com Cores Customizadas */}
          <div className="lg:col-span-6">
            <div className="flex flex-col space-y-4 sm:space-y-5">
              {cards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
                  style={{ y: cardTransforms[index] }}
                  className="w-full"
                >
                  <div
                    className={`group relative rounded-2xl ${card.cardBg} p-6 sm:p-7 shadow-xl hover:shadow-2xl border ${card.borderColor} overflow-hidden transition-all duration-300 ease-out transform hover:-translate-y-2 hover:scale-[1.02] cursor-default`}
                  >
                    <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                      {/* Ícone */}
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
                      >
                        <img src="/background-orcoma.png" alt="" className="w-12 h-12 object-contain brightness-0 invert" />
                      </div>

                      {/* Textos */}
                      <div className="space-y-1.5 flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full ${card.badgeBg} ${card.badgeText} font-extrabold text-xs tracking-wider`}
                          >
                            {card.step}
                          </span>
                          <h3
                            className={`text-lg sm:text-xl font-extrabold ${card.titleColor} tracking-tight`}
                          >
                            {card.title}
                          </h3>
                        </div>
                        <p
                          className={`text-sm sm:text-base leading-relaxed ${card.descColor}`}
                        >
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
