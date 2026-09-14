/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'orcoma_cookie_consent';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já aceitou os cookies
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Pequeno delay para mostrar o banner após a página carregar
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-[slideUp_0.4s_ease-out]">
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Mensagem */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-2xl flex-shrink-0">🍪</span>
              <p className="text-sm text-slate-700 leading-relaxed">
                Utilizamos cookies para garantir a melhor experiência em nosso site.{' '}
                <span className="hidden sm:inline">
                  Se você continuar a usar este site, assumiremos que você está satisfeito com ele.
                </span>
                <a
                  href="/politica-de-privacidade.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0c0ccc] font-semibold hover:text-blue-800 underline ml-1"
                >
                  Política de privacidade
                </a>
              </p>
            </div>

            {/* Botão */}
            <button
              onClick={handleAccept}
              className="flex-shrink-0 bg-[#0c0ccc] hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Sim, concordo!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
