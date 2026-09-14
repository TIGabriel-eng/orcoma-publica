import React from 'react';
import { motion } from 'motion/react';
import { Reveal } from './Reveal';

export const MeiosContato: React.FC = () => {
  return (
    <div id="meios-de-contato" className="w-full">
      {/* 1. Background Branco: Chamada Introdutória */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-sm sm:text-base font-bold text-yellow-500 uppercase tracking-widest mb-3">
            É simples, rápido e fácil
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0c0ccc] tracking-tight">
            Entre em contato conosco!
          </h2>
        </div>
      </section>

      {/* 2. Background #F4F6F79C: Seção Principal com Informações & Cards */}
      <section className="bg-[#F4F6F7]/60 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Coluna da Esquerda: Textos e Botão CTA */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <Reveal delay={0}>
                <span className="text-yellow-500 text-xs sm:text-sm font-bold tracking-wide uppercase">
                  Meios de contato
                </span>
              </Reveal>

              <Reveal delay={0.15}>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  Escolha a forma de contato de sua preferência!
                </h3>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                  Para contar com nossa contabilidade pública em <strong className="text-slate-800">Itaberaba - BA</strong>, você pode nos contatar de diferentes maneiras.
                </p>
              </Reveal>

              <Reveal delay={0.45}>
                <div className="pt-2">
                  <a
                    href="https://wa.me/5575999882400?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20equipe%20de%20Contabilidade%20P%C3%BAblica%20do%20Grupo%20Orcoma."
                    target="_blank"
                    rel="noopener noreferrer"
                    id="btn-meios-contato-cta"
                    className="inline-flex items-center justify-center px-8 py-4 text-sm sm:text-base font-extrabold text-white bg-[#0c0ccc] hover:bg-blue-700 rounded-full shadow-lg hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-0.5 uppercase tracking-wider gap-3 group"
                  >
                    <i className="fa-brands fa-whatsapp text-2xl text-yellow-400 group-hover:scale-110 transition-transform"></i>
                    <span>Entre em contato conosco</span>
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Coluna da Direita: 4 Cards */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 sm:gap-y-12 gap-x-6 pt-6">
                
                {/* Card 1: Entre em contato */}
                <motion.div
                  id="card-contato-telefones"
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0, ease: 'easeOut' }}
                  className="relative bg-white rounded-2xl pt-10 pb-8 px-6 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Floating Circular Badge on top */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#1b254b] flex items-center justify-center shadow-md border-4 border-white transition-transform duration-300 group-hover:scale-110">
                    <i className="fa-solid fa-headset text-yellow-400 text-2xl"></i>
                  </div>

                  <h4 className="text-xl font-bold text-[#0c0ccc] mb-4">
                    Entre em contato
                  </h4>

                  <ul className="space-y-2 text-slate-700 text-sm sm:text-base font-semibold w-full">
                    <li className="flex items-center justify-center gap-2.5">
                      <i className="fa-brands fa-whatsapp text-slate-800 text-base"></i>
                      <a href="https://wa.me/557532514300" target="_blank" rel="noopener noreferrer" className="hover:text-[#0c0ccc] transition-colors">
                        (75) 3251-4300
                      </a>
                    </li>
                    <li className="flex items-center justify-center gap-2.5">
                      <i className="fa-solid fa-phone text-slate-800 text-sm"></i>
                      <a href="tel:7532514300" className="hover:text-[#0c0ccc] transition-colors">
                        (75) 3251-4300
                      </a>
                    </li>
                    <li className="flex items-center justify-center gap-2.5">
                      <i className="fa-solid fa-phone text-slate-800 text-sm"></i>
                      <a href="tel:7139012519" className="hover:text-[#0c0ccc] transition-colors">
                        (71) 3901-2519
                      </a>
                    </li>
                  </ul>
                </motion.div>

                {/* Card 2: Mande um e-mail */}
                <motion.div
                  id="card-contato-email"
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                  className="relative bg-white rounded-2xl pt-10 pb-8 px-6 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Floating Circular Badge on top */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#1b254b] flex items-center justify-center shadow-md border-4 border-white transition-transform duration-300 group-hover:scale-110">
                    <i className="fa-solid fa-envelope text-yellow-400 text-2xl"></i>
                  </div>

                  <h4 className="text-xl font-bold text-[#0c0ccc] mb-4">
                    Mande um e-mail
                  </h4>

                  <div className="text-slate-700 text-sm sm:text-base font-semibold w-full flex items-center justify-center gap-2.5">
                    <i className="fa-regular fa-envelope text-slate-800 text-base shrink-0"></i>
                    <a
                      href="mailto:publica@orcoma.com.br"
                      className="hover:text-[#0c0ccc] transition-colors break-all"
                    >
                      publica@orcoma.com.br
                    </a>
                  </div>
                </motion.div>

                {/* Card 3: Horários */}
                <motion.div
                  id="card-contato-horarios"
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                  className="relative bg-white rounded-2xl pt-10 pb-8 px-6 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Floating Circular Badge on top */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#1b254b] flex items-center justify-center shadow-md border-4 border-white transition-transform duration-300 group-hover:scale-110">
                    <i className="fa-solid fa-clock text-yellow-400 text-2xl"></i>
                  </div>

                  <h4 className="text-xl font-bold text-[#0c0ccc] mb-4">
                    Horários
                  </h4>

                  <div className="space-y-1.5 text-slate-700 text-sm sm:text-base leading-relaxed">
                    <p className="font-semibold">
                      De segunda a quinta das <span className="text-slate-900 font-bold">8h às 18h30</span>.
                    </p>
                    <p className="font-semibold">
                      Às sextas-feiras das <span className="text-slate-900 font-bold">8h às 17h30</span>.
                    </p>
                  </div>
                </motion.div>

                {/* Card 4: Siga-nos no Instagram */}
                <motion.div
                  id="card-contato-instagram"
                  initial={{ opacity: 0, x: 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                  className="relative bg-white rounded-2xl pt-10 pb-8 px-6 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                >
                  {/* Floating Circular Badge on top */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-[#1b254b] flex items-center justify-center shadow-md border-4 border-white transition-transform duration-300 group-hover:scale-110">
                    <i className="fa-brands fa-instagram text-yellow-400 text-2xl"></i>
                  </div>

                  <h4 className="text-xl font-bold text-[#0c0ccc] mb-4">
                    Siga-nos no Instagram
                  </h4>

                  <div className="text-slate-700 text-sm sm:text-base font-semibold flex items-center justify-center gap-2">
                    <i className="fa-brands fa-instagram text-slate-800 text-lg"></i>
                    <a
                      href="https://www.instagram.com/orcomapublica"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-800 hover:text-[#0c0ccc] transition-colors"
                    >
                      @orcomapublica
                    </a>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

// Export alias para compatibilidade
export const Unidades = MeiosContato;
