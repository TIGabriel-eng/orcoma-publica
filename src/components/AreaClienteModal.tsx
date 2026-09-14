import React from 'react';
import { OrcomaLogo } from './OrcomaLogo';

interface AreaClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContactSupport?: () => void;
}

export const AreaClienteModal: React.FC<AreaClienteModalProps> = ({
  isOpen,
  onClose,
  onContactSupport,
}) => {
  if (!isOpen) return null;

  const clientServices = [
    {
      title: 'Emissão de Guias e Tributos',
      desc: 'Acesse DAS, DARF, FGTS, GPS e guias municipais atualizadas.',
      icon: 'fa-solid fa-file-invoice-dollar',
      badge: 'Guias & Impostos',
      action: 'Acessar Guias',
    },
    {
      title: 'Sistema Contábil & Gestão (Onvio)',
      desc: 'Portal seguro para envio de documentos, notas fiscais e relatórios.',
      icon: 'fa-solid fa-cloud-arrow-up',
      badge: 'Plataforma Web',
      action: 'Entrar no Sistema',
    },
    {
      title: 'Solicitação de Documentos e CNDs',
      desc: 'Peça certidões negativas, informes de rendimentos e contratos.',
      icon: 'fa-solid fa-certificate',
      badge: 'Certidões & Atos',
      action: 'Solicitar Certidão',
    },
    {
      title: 'Folha de Pagamento & eSocial',
      desc: 'Envio de movimentações de admissão, férias, rescisão e holerites.',
      icon: 'fa-solid fa-users-gear',
      badge: 'Departamento Pessoal',
      action: 'Enviar Movimento',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[linear-gradient(160deg,rgb(12,12,204)_0%,rgb(26,26,255)_50%,rgb(0,0,179)_100%)] text-white p-6 sm:p-7 relative border-b border-white/15">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-200 hover:text-white p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
            aria-label="Fechar modal"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2.5 py-0.5 rounded bg-yellow-400 text-[#0c0ccc] text-[11px] font-black uppercase tracking-wider">
              Área Exclusiva
            </span>
            <OrcomaLogo variant="light" size="sm" />
          </div>

          <h3 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <i className="fa-solid fa-door-open text-yellow-400"></i>
            Portal de Atendimento e Serviços
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            Selecione o serviço desejado para acessar a plataforma ou solicitar suporte direto à nossa equipe técnica.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-4 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {clientServices.map((srv, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-gray-200 hover:border-yellow-400 bg-gray-50 hover:bg-white transition-all shadow-sm hover:shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0c0ccc] flex items-center justify-center text-lg font-bold">
                      <i className={srv.icon}></i>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded">
                      {srv.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0c0ccc] mb-1">
                    {srv.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {srv.desc}
                  </p>
                </div>
                <a
                  href={`https://wa.me/5575999882400?text=Ol%C3%A1%2C%20sou%20cliente%20do%20Grupo%20Orcoma%20e%20gostaria%20de%20acesso%20ao%20servi%C3%A7o%20de%3A%20${encodeURIComponent(srv.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center py-2 px-3 rounded-md bg-[linear-gradient(160deg,rgb(12,12,204)_0%,rgb(26,26,255)_50%,rgb(0,0,179)_100%)] text-yellow-400 text-xs font-bold transition-opacity hover:opacity-90 uppercase tracking-wider"
                >
                  <i className="fa-solid fa-arrow-up-right-from-square mr-1.5 text-[10px]"></i>
                  {srv.action}
                </a>
              </div>
            ))}
          </div>

          {/* Quick Support Strip */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0c0ccc] text-yellow-400 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-headset text-base"></i>
              </div>
              <div>
                <h5 className="text-xs font-bold text-[#0c0ccc]">
                  Dúvidas com seu Acesso ou Senha?
                </h5>
                <p className="text-[11px] text-gray-600">
                  Nossa equipe de suporte ao cliente está disponível para auxiliá-lo imediatamente.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onContactSupport?.();
              }}
              className="shrink-0 px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-300 text-[#0c0ccc] text-xs font-extrabold uppercase tracking-wider transition-colors shadow-sm"
            >
              Falar com Suporte
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-4 sm:px-7 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <i className="fa-solid fa-shield-halved text-yellow-500"></i>
            Ambiente seguro e criptografado
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded text-gray-600 hover:text-gray-900 font-semibold"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
