import React from 'react';
import { Reveal } from './Reveal';

interface GoogleReview {
  name: string;
  time: string;
  text: string;
}

const reviews: GoogleReview[] = [
  {
    name: 'Zene Almeida',
    time: '3 anos atrás',
    text: 'Bem atendida, dúvidas sanadas, pendências da empresa resolvidas.',
  },
  {
    name: 'Macleide Ramos',
    time: '3 anos atrás',
    text: 'Excelente, empresa comprometida e com seus colaboradores competentes e capacitados!',
  },
  {
    name: 'Iracilde Trindade',
    time: '3 anos atrás',
    text: 'Excelente, porque podemos contar com uma equipe eficaz nas mais diversas áreas. Parabéns Orcoma, continue!',
  },
  {
    name: 'Damiana Portella',
    time: '3 anos atrás',
    text: 'Atendimento agilizado e resolutivo. Equipe excelente e muito bem preparada! Sinto segurança em ter minha empresa cuidada pela Orcoma.',
  },
  {
    name: 'Leonardo Barbosa',
    time: '2 semanas atrás',
    text: 'Melhor contabilidade',
  },
  {
    name: 'Ieda Cunha',
    time: '2 semanas atrás',
    text: 'Orcoma Contabilidade, essa faz toda diferença. Competente em tudo que faz.',
  },
  {
    name: 'Leiane Mascarenhas',
    time: '2 semanas atrás',
    text: 'Excelente serviço de contabilidade.',
  },
  {
    name: 'Lorena Larisse',
    time: '6 meses atrás',
    text: '',
  },
];

const Star = () => (
  <i className="fa-solid fa-star text-yellow-400 text-xl sm:text-2xl"></i>
);

const GoogleLogo: React.FC<{ size?: 'sm' | 'lg' }> = ({ size = 'sm' }) => (
  <div
    className={`flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 shrink-0 ${
      size === 'lg' ? 'w-[60px] h-[60px]' : 'w-10 h-10'
    }`}
  >
    <svg viewBox="0 0 24 24" width={size === 'lg' ? '36' : '24'} height={size === 'lg' ? '36' : '24'} xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  </div>
);

export const Clientes: React.FC = () => {
  const items = [...reviews, ...reviews];

  return (
    <section id="clientes" className="py-20 lg:py-28 bg-white relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Título Centralizado */}
        <Reveal>
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block text-sm sm:text-base font-extrabold text-yellow-500 uppercase tracking-widest">
            Clientes Orcoma
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#07075c] tracking-tight mt-2">
            Nossos clientes falam por nós!
          </h2>

          {/* Bloco de Avaliação Google Centralizado */}
          <div className="mt-10 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-800 uppercase tracking-wider">
              Excelente
            </span>
            <div className="flex items-center gap-1.5 mt-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} />
              ))}
            </div>
            <div className="flex items-center gap-2.5 mt-4">
              <GoogleLogo size="lg" />
              <span className="text-xl sm:text-2xl text-slate-500">Com base em 100 avaliações</span>
            </div>
            <span className="text-lg font-bold text-slate-400 mt-1.5">Google</span>
          </div>
        </div>
        </Reveal>
      </div>

      {/* Carrossel Infinito de Avaliações */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        }}
      >
        <div className="flex w-max animate-marquee gap-6 px-4">
          {items.map((review, index) => (
            <Reveal key={`${review.name}-${index}`} delay={Math.min(index % 8, 4) * 0.1} y={20}>
            <div
              className="w-[320px] sm:w-[360px] shrink-0 h-[200px] bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative flex flex-col"
            >
              {/* Google G no canto superior direito */}
              <div className="absolute top-4 right-4">
                <GoogleLogo />
              </div>

              {/* Avatar inicial + nome + tempo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0c0ccc] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-slate-800 truncate">{review.name}</div>
                  <div className="text-xs text-slate-500">{review.time}</div>
                </div>
              </div>

              {/* Estrelas */}
              <div className="flex items-center gap-1 mt-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} />
                ))}
              </div>

              {/* Texto do comentário - ocupa o espaço restante */}
              <div className="flex-1 mt-3 overflow-hidden">
                {review.text ? (
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {review.text}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400 italic">
                    Avaliação sem comentário
                  </p>
                )}
              </div>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
