import React, { useState } from 'react';
import { Reveal } from './Reveal';

/** Aplica máscara de telefone brasileiro enquanto se digita. */
function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (digits.length <= 10) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export const FormularioEspecialista: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    formaContato: 'WhatsApp', // Ligação, WhatsApp, E-mail
    concordaPrivacidade: false,
  });

  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (!formData.concordaPrivacidade) {
      alert('Por favor, aceite a Política de Privacidade para continuar.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          formaContato: formData.formaContato,
        }),
      });
      if (!response.ok) throw new Error('Falha ao enviar.');
      setEnviado(true);
    } catch {
      setErro('Não foi possível enviar agora. Tente novamente em instantes ou fale conosco pelo WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de falar com um especialista em Contabilidade Pública do Grupo Orcoma.`
  );

  return (
    <section id="contato" className="py-20 lg:py-28 bg-[#0c0ccc] relative overflow-hidden scroll-mt-20">
      {/* Wave Divider Superior (Transição da seção anterior -> Azul) */}
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
            d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z"
            fill="#FFFFFF"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LADO ESQUERDO: Formulário */}
          <Reveal delay={0} className="lg:col-span-6 order-2 lg:order-1">
          <div>
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_15px_35px_-5px_rgba(0,0,0,0.06)] border border-slate-200/80 relative">
              <div className="mb-8">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0c0ccc] leading-tight">
                  Preencha o formulário e aguarde o nosso contato
                </h3>
                <p className="text-sm text-slate-500 mt-2">
                  Retornaremos com agilidade e total sigilo.
                </p>
              </div>

              {enviado ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-sm">
                    <i className="fa-solid fa-check"></i>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">
                    Mensagem enviada com sucesso!
                  </h4>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Obrigado, <strong className="text-slate-900">{formData.nome}</strong>. Nossos especialistas em contabilidade pública entrarão em contato em breve via {formData.formaContato}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEnviado(false);
                      setFormData({
                        nome: '',
                        telefone: '',
                        email: '',
                        formaContato: 'WhatsApp',
                        concordaPrivacidade: false,
                      });
                    }}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0c0ccc] hover:underline pt-4"
                  >
                    <i className="fa-solid fa-arrow-rotate-left"></i>
                    <span>Enviar outra mensagem</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nome */}
                  <div>
                    <label htmlFor="input-nome" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Insira seu nome <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <i className="fa-regular fa-user"></i>
                      </div>
                      <input
                        id="input-nome"
                        type="text"
                        required
                        placeholder="Seu nome completo"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c0ccc] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div>
                    <label htmlFor="input-telefone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Insira seu telefone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <input
                        id="input-telefone"
                        type="tel"
                        required
                        placeholder="(75) 99999-9999"
                        maxLength={15}
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData({ ...formData, telefone: maskPhone(e.target.value) })
                        }
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c0ccc] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div>
                    <label htmlFor="input-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Insira seu e-mail <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <i className="fa-regular fa-envelope"></i>
                      </div>
                      <input
                        id="input-email"
                        type="email"
                        required
                        placeholder="seuemail@orgao.ba.gov.br ou pessoal"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0c0ccc] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Forma de Contato Preferencial */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Qual a melhor forma de entrarmos em contato?
                    </label>
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                      {[
                        { label: 'Ligação', icon: 'fa-solid fa-phone-volume' },
                        { label: 'WhatsApp', icon: 'fa-brands fa-whatsapp' },
                        { label: 'E-mail', icon: 'fa-regular fa-envelope' },
                      ].map((item) => (
                        <label
                          key={item.label}
                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-bold cursor-pointer transition-all ${
                            formData.formaContato === item.label
                              ? 'bg-[#0c0ccc] text-white border-[#0c0ccc] shadow-sm'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="formaContato"
                            value={item.label}
                            checked={formData.formaContato === item.label}
                            onChange={(e) => setFormData({ ...formData, formaContato: e.target.value })}
                            className="sr-only"
                          />
                          <i className={`${item.icon} ${formData.formaContato === item.label ? 'text-yellow-400' : 'text-slate-500'}`}></i>
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Termos de Privacidade */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        required
                        checked={formData.concordaPrivacidade}
                        onChange={(e) => setFormData({ ...formData, concordaPrivacidade: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-[#0c0ccc] border-slate-300 focus:ring-[#0c0ccc] cursor-pointer"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed group-hover:text-slate-800">
                        Li e concordo com a <a href="/politica-de-privacidade.html" target="_blank" rel="noopener noreferrer" className="text-[#0c0ccc] font-semibold underline hover:text-blue-800">Política de Privacidade</a>.
                      </span>
                    </label>
                  </div>

                  {/* Botão Enviar */}
                  <div className="pt-3">
                    {erro && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-3">
                        {erro}
                      </p>
                    )}
                    <button
                      id="btn-enviar-formulario"
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center px-8 py-4 text-base font-extrabold text-white bg-[#0c0ccc] hover:bg-blue-800 rounded-full shadow-lg hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-0.5 uppercase tracking-wider gap-3 group disabled:opacity-75 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <i className="fa-solid fa-circle-notch fa-spin text-yellow-400 text-lg"></i>
                          <span>Enviando dados...</span>
                        </>
                      ) : (
                        <>
                          <span>Enviar formulário agora mesmo!</span>
                          <i className="fa-solid fa-arrow-right text-yellow-400 group-hover:translate-x-1 transition-transform"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          </Reveal>

          {/* LADO DIREITO: Informações & CTA Especialista */}
          <Reveal delay={0.15} className="lg:col-span-6 space-y-6 order-1 lg:order-2 text-left lg:pl-[7.5rem]">
            <span className="inline-block text-sm sm:text-base font-extrabold text-yellow-400 uppercase tracking-widest">
              Estamos preparados para te ajudar!
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              A solução para a sua contabilidade pública!
            </h2>

            <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-xl">
              Preencha o formulário e garanta um serviço especializado na administração pública que conhece as melhores soluções para garantir a sua segurança.
            </p>

            <div className="pt-4">
              <a
                href={`https://wa.me/5575999882400?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                id="btn-falar-especialista"
                className="inline-flex items-center justify-center px-8 py-4 text-sm sm:text-base font-extrabold text-[#0c0ccc] bg-yellow-400 hover:bg-yellow-300 rounded-full shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:-translate-y-0.5 uppercase tracking-wider gap-3 group"
              >
                <i className="fa-solid fa-user-tie text-xl group-hover:scale-110 transition-transform"></i>
                <span>Falar com um especialista</span>
              </a>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
};
