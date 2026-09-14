import React from 'react';
import { Differential } from '../types';
import { Reveal } from './Reveal';

export const Diferenciais: React.FC = () => {
  const diferenciais: Differential[] = [
    {
      id: 'planejamento-orcamento',
      title: 'Assessoria em Planejamento e Orçamento',
      icon: 'fa-solid fa-calculator',
      description:
        'Planejamento orçamentário completo e estratégico para garantir conformidade legal e eficácia na gestão pública.',
      highlight: 'Gestão Estratégica',
      items: [
        'Elaboração do projeto de Lei de Diretrizes Orçamentárias — LDO.',
        'Elaboração da Previsão da Receita.',
        'Elaboração do projeto de Lei Orçamentária Anual — LOA.',
        'Elaboração do Plano Plurianual — PPA.',
        'Orientações e realizações de alterações orçamentárias.',
      ],
    },
    {
      id: 'assessoria-contabil',
      title: 'Assessoria Contábil',
      icon: 'fa-solid fa-file-invoice-dollar',
      description:
        'Acompanhamento contábil rigoroso, emissão de relatórios fiscais e prestação de contas com total segurança.',
      highlight: 'Controle & Conformidade',
      items: [
        'Acompanhamento diário da execução orçamentária e financeira.',
        'Prestação de contas mensais e anuais.',
        'Suporte à Lei de Acesso à Informação.',
        'Elaboração do Relatório Resumido da Execução Orçamentária e Relatório de Gestão Fiscal.',
        'Elaboração de relatórios e apresentação de audiências públicas.',
        'Relatórios gerenciais.',
        'Elaboração e acompanhamento de respostas às notificações dos órgãos de controle.',
        'Acompanhamento diário e conferência de documentações com visitas mensais.',
      ],
    },
    {
      id: 'sistemas-informacoes',
      title: 'Assessoria aos Sistemas de Informações Contábeis',
      icon: 'fa-solid fa-network-wired',
      description:
        'Suporte técnico e parametrização especializada nos principais sistemas de dados e informações contábeis governamentais.',
      highlight: 'SIAFIC & Plataformas',
      items: [
        'SICONFI.',
        'SIOPS.',
        'SIOPE.',
        'SADIPEM.',
        'Consultoria na implantação do SIAFIC.',
      ],
    },
  ];

  return (
    <section id="diferenciais" className="pt-12 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid with 3 Differentials - Card 2 elevated high above 1 and 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch pt-6 md:pt-16 lg:pt-20">
          {diferenciais.map((item, index) => {
            const isAssessoriaContabil = item.id === 'assessoria-contabil';

            if (isAssessoriaContabil) {
              return (
                <Reveal key={item.id} delay={0.1} className="h-full flex">
                <div
                  id={`differential-card-${item.id}`}
                  className="w-full group relative bg-[#0c0ccc] rounded-2xl p-7 sm:p-8 border-2 border-blue-500 shadow-2xl transition-all duration-300 transform md:-translate-y-12 lg:-translate-y-16 hover:md:-translate-y-14 hover:lg:-translate-y-18 flex flex-col justify-between z-10 ring-4 ring-[#0c0ccc]/10"
                >
                  {/* Card Top / Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-yellow-400 text-[#0c0ccc] flex items-center justify-center text-2xl shadow-md group-hover:scale-105 transition-transform">
                        <i className={item.icon}></i>
                      </div>
                      <span className="text-xs font-extrabold text-white/80">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="mb-3">
                      <span className="inline-block text-[11px] font-extrabold text-yellow-400 uppercase tracking-wider mb-1">
                        {item.highlight}
                      </span>
                      <h3 className="text-xl font-bold text-yellow-400">
                        {item.title}
                      </h3>
                    </div>

                    {item.items && item.items.length > 0 ? (
                      <ul className="space-y-2.5 mt-3 text-white text-sm leading-relaxed">
                        {item.items.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="relative flex h-2.5 w-2.5 mt-1.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400 shadow-sm animate-pulse"></span>
                            </span>
                            <span className="text-white font-medium">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Accent / Saiba mais Link */}
                  <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-yellow-400">
                    <a href="#contato" className="flex items-center gap-1.5 hover:underline">
                      <span>Saiba mais</span>
                      <i className="fa-solid fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                    </a>
                  </div>
                </div>
                </Reveal>
              );
            }

            return (
              <Reveal key={item.id} delay={(index % 3) * 0.15} className="h-full flex">
              <div
                id={`differential-card-${item.id}`}
                className="w-full group relative bg-white rounded-xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:border-yellow-400 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Card Top / Icon */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#0c0ccc] group-hover:bg-yellow-400 group-hover:text-[#0c0ccc] flex items-center justify-center text-2xl transition-all duration-300 shadow-sm">
                      <i className={item.icon}></i>
                    </div>
                    <span className="text-xs font-bold text-gray-400 group-hover:text-yellow-600 transition-colors">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="inline-block text-[11px] font-bold text-yellow-600 uppercase tracking-wider mb-1">
                      {item.highlight}
                    </span>
                    <h3 className="text-xl font-bold text-[#0c0ccc] group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  {item.items && item.items.length > 0 ? (
                    <ul className="space-y-2.5 mt-3 text-gray-600 text-sm leading-relaxed">
                      {item.items.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="relative flex h-2.5 w-2.5 mt-1.5 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-500 shadow-sm animate-pulse"></span>
                          </span>
                          <span className="text-gray-700 font-medium">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Bottom Accent / Saiba mais Link */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0c0ccc] group-hover:text-yellow-600 transition-colors">
                  <a href="#contato" className="flex items-center gap-1.5 hover:underline">
                    <span>Saiba mais</span>
                    <i className="fa-solid fa-arrow-right text-[10px] transform group-hover:translate-x-1 transition-transform"></i>
                  </a>
                </div>
              </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
