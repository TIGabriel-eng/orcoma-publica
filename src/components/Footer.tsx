import React from 'react';
import { OrcomaLogo } from './OrcomaLogo';
import { Reveal } from './Reveal';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050550] text-gray-200 border-t border-white/15 text-sm">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Institutional Summary */}
          <div className="lg:col-span-2 space-y-4">
            <div className="mb-2">
              <OrcomaLogo variant="light" size="lg" />
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-sm">
              A Orcoma nasceu em 1987 com a missão de simplificar a contabilidade. Desde então, vem destacando na área, pela excelência dos serviços prestados e por possuir uma visão inovadora e estratégica. Atuando na contabilidade pública e privada objetiva trazer as melhores soluções aos seus clientes, considerando as peculiaridades de cada um.
            </p>

            {/* Social Icons (FontAwesome) */}
            <div className="pt-2 flex items-center space-x-3">
              <a
                href="https://www.instagram.com/orcomapublica/"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center text-gray-200 hover:text-yellow-400 hover:border-yellow-400/60 transition-colors"
                aria-label="Instagram do Grupo Orcoma"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Col 3: Navegação Rápida */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#inicio" className="hover:text-yellow-400 transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-yellow-400 transition-colors">
                  Sobre Nós (1987)
                </a>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-yellow-400 transition-colors">
                  Nossos Diferenciais
                </a>
              </li>
              <li>
                <a href="#servicos" className="hover:text-yellow-400 transition-colors">
                  Soluções Especializadas
                </a>
              </li>
              <li>
                <a href="#unidades" className="hover:text-yellow-400 transition-colors text-yellow-400/90 font-medium">
                  Unidades Regionais (BA)
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-yellow-400 transition-colors">
                  Blog & Artigos
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-yellow-400 transition-colors">
                  Fale Conosco
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Soluções */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              O que fazemos
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#diferenciais" className="hover:text-yellow-400 transition-colors">
                  Assessoria Contábil
                </a>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-yellow-400 transition-colors">
                  Assessoria em Planejamento e Orçamento
                </a>
              </li>
              <li>
                <a href="#diferenciais" className="hover:text-yellow-400 transition-colors">
                  Assessoria aos Sistemas de Informações Contábeis
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Contato */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              Centrais de Atendimento
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-phone text-yellow-400 mt-1"></i>
                <div>
                  <a href="tel:+557532512400" className="text-white hover:text-yellow-400 transition-colors block font-semibold">
                    (75) 3251-2400
                  </a>
                  <span className="text-[11px] text-gray-400">Matriz - Itaberaba / BA</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-phone text-yellow-400 mt-1"></i>
                <div>
                  <a href="tel:+557130110000" className="text-white hover:text-yellow-400 transition-colors block font-semibold">
                    (71) 3011-0000
                  </a>
                  <span className="text-[11px] text-gray-400">Unidade Salvador / BA</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-brands fa-whatsapp text-emerald-400 mt-1"></i>
                <a href="https://wa.me/5575999882400" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  (75) 99988-2400 (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-regular fa-envelope text-yellow-400 mt-1"></i>
                <a href="mailto:publica@orcoma.com.br" className="hover:text-yellow-400 transition-colors break-all">
                  publica@orcoma.com.br
                </a>
              </li>
            </ul>
          </div>

        </div>
        </Reveal>
      </div>

      {/* Bottom Bar: Copyright & Compliance */}
      <div className="bg-[#020228] border-t border-white/10 py-6 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left">
            © {currentYear} Grupo Orcoma - Assessoria & Contabilidade. Todos os direitos reservados 
          </p>
          <div className="flex items-center space-x-6 text-[11px] text-gray-400">
            <span>Feito com 🩵 pelos Desenvolvedores do Grupo Orcoma - G </span>
            <span>•</span>
            <a
              href="/politica-de-privacidade.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors"
            >
              Política de Privacidade
            </a>
            <span>•</span>
            <a href="#inicio" className="hover:text-yellow-400 transition-colors">
              LGPD & Segurança
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
