import React from 'react';
import { ServiceItem } from '../types';

interface ServiceModalProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestQuote: (serviceTitle: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  isOpen,
  onClose,
  onRequestQuote,
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001B3B]/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-300 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[linear-gradient(160deg,rgb(12,12,204)_0%,rgb(26,26,255)_50%,rgb(0,0,179)_100%)] text-white p-6 sm:p-7 relative border-b border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-white p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
            aria-label="Fechar modal"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-yellow-400 text-[#0c0ccc] text-xs font-bold uppercase tracking-wider">
              {service.tag}
            </span>
            <span className="text-blue-100 text-xs">{service.badge}</span>
          </div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-3">
            <i className={`${service.icon} text-yellow-400`}></i>
            {service.title}
          </h3>
          <p className="text-blue-100 text-sm mt-1">{service.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Visão Geral do Escopo
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {service.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
              Principais Soluções Inclusas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800"
                >
                  <i className="fa-solid fa-circle-check text-yellow-500 mt-0.5 text-sm"></i>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
            <i className="fa-solid fa-circle-info text-[#0c0ccc] mt-0.5 text-base"></i>
            <div>
              <div className="text-xs font-bold text-[#0c0ccc]">Público-Alvo</div>
              <div className="text-xs text-gray-600 mt-0.5">
                {service.targetAudience}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="bg-gray-50 border-t border-gray-200 p-5 sm:px-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() => {
              onRequestQuote(service.title);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-[#0c0ccc] text-xs sm:text-sm font-bold shadow-md transition-all duration-200 uppercase tracking-wider"
          >
            <i className="fa-solid fa-paper-plane mr-2"></i>
            Solicitar Proposta para {service.tag}
          </button>
        </div>
      </div>
    </div>
  );
};
