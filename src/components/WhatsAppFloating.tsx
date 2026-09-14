import React, { useState, useEffect, useRef } from 'react';

const ROTATING_MESSAGES = [
  'Bem vindo(a), eu me chamo Ana. Se precisar de alguma ajuda, eu estou aqui. Tah? :)',
  'Ei, sabia que você pode consultar os nossos especialistas e tornar a sua procura ainda mais fácil? Vem cá que vou te explicar mais! :D',
  'Poxa, você ainda não clicou em mim? :( Mas saiba que eu estou aqui se você precisar de ajuda, ta?',
  'Nossa equipe de especialistas está em prontidão para te atender!!',
];

const GREETING = 'Olá! Que bom que você clicou em mim!! :D Como posso te ajudar hoje?';

const SERVICES_TEXT =
  'A Orcoma é especialista em contabilidade pública e privada! Em Itaberaba, localizado no interior do estado da Bahia, oferecemos soluções inovadoras e estratégicas para atender às exigências legais e fiscais, com ética e transparência. Posso te explicar mais sobre algum serviço específico? :)';

const CONTACT_TEXT =
  'Claro! Nossos meios de contato são: Matriz Itaberaba/BA (75) 3251-2400, Unidade Salvador/BA (71) 3011-0000, WhatsApp (75) 99988-2400 e e-mail publica@orcoma.com.br. Quer que eu te direcione para um especialista? :D';

const HOURS_TEXT =
  'Nosso atendimento funciona de segunda a quinta das 08h às 18h30, e às sextas das 08h às 17h30. Precisando de algo dentro desse horário? :)';

const PRICE_TEXT =
  'Os valores dependem de cada caso e das necessidades da sua empresa/órgão. Posso te encaminhar para um especialista montar um orçamento personalizado pra você! Quer? :)';

const FALLBACK_ASK_CITY =
  'Ei, antes de eu te redirecionar para um dos nossos especialistas, consegue me informar de qual cidade/estado você deseja ser atendido? Se não tivermos unidades na sua cidade, podemos te encaminhar para cidades próximas de você! :D';

const COMPLAINT_TEXT =
  'Poxa...eu compreendo a sua insatisfação com os nossos atendimentos e lamento por isso. Poderia nos informar com detalhes o por que da sua insatisfação com os nossos serviços? Estamos aqui para te atender da melhor forma possível!';

const COMPLAINT_AFTER_DETAIL =
  'Obrigada pelo seu relato e desculpe novamente pelo transtorno. Vou encaminhar toda a sua mensagem para um especialista, que vai intermediar a conversa com você pelo WhatsApp para resolver isso da melhor forma. Um momento... :(';

const PRAISE_TEXT =
  'Que bom! Fico muito feliz com o seu elogio. :D Ele também vai nos ajudar a aprimorar ainda mais os nossos atendimentos. Obrigada pelo carinho! Qualquer coisa é só chamar. :)';

const FLIRT_TEXT =
  'Ahh, que fofo! :D Mas eu sou apenas uma atendente virtual, minha função aqui é te ajudar a resolver qualquer coisa sobre a Orcoma. Me conta o que você precisa? Vou ficar muito feliz em ajudar! :)';

const SOCIAL_TEXT =
  'Oi! Também fico feliz em falar com você. :D Como posso te ajudar hoje? Estou aqui pra isso!';

interface BotRule {
  keywords: string[];
  reply: string;
  redirect: boolean;
  awaitComplaintDetail?: boolean;
}

const CHAT_RULES: BotRule[] = [
  {
    keywords: [
      'burro', 'burra', 'idiota', 'incompetente', 'incompetencia', 'lixo', 'droga',
      'merda', 'merd', 'fdp', 'filho da puta', 'vsf', 'vai se fuder', 'vagabundo',
      'arrombado', 'pilantra', 'canalha', 'nojento', 'imbecil', 'otario', 'otário',
      'trouxa', 'palhaco', 'palhaço', 'escroto', 'corno', 'desgraçado', 'babaca',
    ],
    reply: COMPLAINT_TEXT,
    redirect: false,
    awaitComplaintDetail: true,
  },
  {
    keywords: [
      'reclam', 'problema', 'insatisfeit', 'pessimo', 'péssimo', 'horrivel',
      'decepcionad', 'errado', 'falha', 'erro', 'nao gost', 'não gost', 'ruim',
      'demora', 'atraso', 'prejuiz', 'pior', 'raiva', 'frustrad', 'picaret',
      'golp', 'vergonha', 'absurdo', 'lastimavel', 'lamentavel',
    ],
    reply: COMPLAINT_TEXT,
    redirect: false,
    awaitComplaintDetail: true,
  },
  {
    keywords: [
      'obrigad', 'amei', 'adorei', 'parabens', 'otimo', 'ótimo', 'excelente',
      'recomendo', 'maravilh', 'perfeito', 'legal', 'show', 'top', 'muito bom',
    ],
    reply: PRAISE_TEXT,
    redirect: false,
  },
  {
    keywords: [
      'namora', 'namorar', 'namorada', 'namorado', 'casa comigo', 'casamento',
      'apaixonei', 'apaixon', 'beijo', 'beijar', 'te amo', 'gostosa', 'linda',
      'gata', 'lindinha', 'querida', 'paquera', 'ficar comigo', 'pra sempre',
      'linda demais', 'pu', 'crush',
    ],
    reply: FLIRT_TEXT,
    redirect: false,
  },
  {
    keywords: [
      'oi', 'ola', 'olá', 'boa tarde', 'bom dia', 'boa noite', 'eai', 'e ai',
      'opa', 'fala', 'salve', 'hey', 'blz', 'beleza', 'tudo bem', 'td bem',
      'como vai', 'como voce esta', 'tu ta', 'e voce', 'e você',
    ],
    reply: SOCIAL_TEXT,
    redirect: false,
  },
  {
    keywords: [
      'preço', 'preco', 'valor', 'custo', 'quanto', 'orçamento', 'orcamento', 'precos', 'preços', 'valores',
    ],
    reply: PRICE_TEXT,
    redirect: true,
  },
  {
    keywords: [
      'serviço', 'servico', 'serviços', 'servicos', 'contabilidade', 'contabil',
      'assessoria', 'solução', 'solucao', 'soluções', 'solucoes', 'empresa',
      'abertura', 'contabil',
    ],
    reply: SERVICES_TEXT,
    redirect: false,
  },
  {
    keywords: [
      'telefone', 'contato', 'falar', 'ligar', 'email', 'e-mail', 'whatsapp',
      'onde', 'localiza', 'endereço', 'endereco', 'localização', 'localizacao', 'próximo', 'proximo',
    ],
    reply: CONTACT_TEXT,
    redirect: true,
  },
  {
    keywords: [
      'horário', 'horario', 'funcionamento', 'aberto', 'quando', 'atend',
      'sla', 'horarios',
    ],
    reply: HOURS_TEXT,
    redirect: false,
  },
];

const BA_CITIES = [
  'itaberaba', 'salvador', 'feira', 'santo antonio', 'santo antonio de jesus',
  'lauro', 'camacari', 'camaçari', 'cachoeira', 'cruz das almas', 'ibirataia',
  'ipiau', 'ipiaú', 'jacobina', 'jequie', 'jequie', 'seabra', 'lencois', 'lençois',
  'mucuge', 'palmeiras', 'ruy barbosa', 'serrinha', 'laje', 'mutuipe', 'amargosa',
  'santa terezinha', 'boa vista', 'oureco', 'ouricuri', 'angical', 'macajuba',
  'mundo novo', 'piritiba', 'tapiramuta', 'ubaíra', 'ubaira', 'vitoria da conquista',
  'vitoria', 'conquista', 'ilheus', 'ilhéus', 'itabuna', 'barreiras', 'juazeiro',
  'valenca', 'valença', 'bonito', 'boquira', 'guanambe', 'claudio', 'cláudio',
];

const SP_KEYWORDS = ['sao paulo', 'são paulo', 'sp', 'capital', 'guarulhos', 'campinas', 'sbc', 'osasco', 'santos', 'sao bernardo', 'são bernardo'];

const FOREIGN_GENERIC = [
  'argentina', 'eua', 'estados unidos', 'portugal', 'espanha', 'franca',
  'inglaterra', 'alemanha', 'canada', 'mexico', 'chile', 'colombia', 'uruguai',
  'paraguai', 'italia', 'japao', 'china', 'australia', 'europa',
];

interface LocationResult {
  type: 'bahia' | 'sp' | 'foreign' | 'other';
  label: string;
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function classifyLocation(text: string): LocationResult {
  const normalized = normalize(text);

  if (BA_CITIES.some((c) => normalized.includes(c)) || /bahia| ba\b/.test(normalized)) {
    return { type: 'bahia', label: 'na Bahia' };
  }
  if (SP_KEYWORDS.some((c) => normalized.includes(c))) {
    return { type: 'sp', label: 'em São Paulo' };
  }
  if (FOREIGN_GENERIC.some((c) => normalized.includes(c))) {
    return { type: 'foreign', label: 'fora do Brasil' };
  }
  return { type: 'other', label: '' };
}

function extractNewName(text: string): string | null {
  const normalized = normalize(text);
  const patterns = [
    /(?:seu|teu|sua|tua)\s+(?:novo\s+nome\s+(?:e|é)|nome\s+(?:e|é))\s+([a-zà-ú]{2,30})/i,
    /(?:agora\s+(?:seu|teu)\s+nome\s+(?:e|é))\s+([a-zà-ú]{2,30})/i,
    /(?:meu\s+nome\s+(?:e|é))\s+([a-zà-ú]{2,30})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
  }
  return null;
}

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const WhatsAppFloating: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReply, setShowQuickReply] = useState(false);
  const [showRedirectPill, setShowRedirectPill] = useState(false);
  const [awaitingCity, setAwaitingCity] = useState(false);
  const [awaitingComplaintDetail, setAwaitingComplaintDetail] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const rotateTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (isOpen || chatMessages.length > 0) return;

    const scheduleNext = () => {
      rotateTimeoutRef.current = setTimeout(() => {
        setIsFading(true);
        fadeTimeoutRef.current = setTimeout(() => {
          setMessageIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
          setIsFading(false);
          scheduleNext();
        }, 300);
      }, 5500);
    };

    scheduleNext();

    return () => {
      clearTimeout(rotateTimeoutRef.current);
      clearTimeout(fadeTimeoutRef.current);
    };
  }, [isOpen, chatMessages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const handleOpenChat = () => {
    setIsOpen(true);
    if (chatMessages.length === 0) {
      setShowQuickReply(true);
      setTimeout(() => {
        setChatMessages([{ text: GREETING, isUser: false, timestamp: new Date() }]);
      }, 400);
    }
  };

  const handleCloseChat = () => {
    setAwaitingComplaintDetail(false);
    setAwaitingCity(false);
    setIsOpen(false);
  };

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text) return;

    setChatMessages((prev) => [...prev, { text, isUser: true, timestamp: new Date() }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const newName = extractNewName(text);
      if (newName && normalize(text).includes('nome')) {
        setShowRedirectPill(false);
        setAwaitingComplaintDetail(false);
        setAwaitingCity(false);
        setChatMessages((prev) => [
          ...prev,
          {
            text: 'Que bonitinho! Mas o meu nome é Ana. Meu desenvolvedor me batizou assim! hehe. No que posso te ajudar hoje? :)',
            isUser: false,
            timestamp: new Date(),
          },
        ]);
        return;
      }

      if (awaitingComplaintDetail) {
        setShowRedirectPill(false);
        setAwaitingComplaintDetail(false);
        const detail = text;

        setChatMessages((prev) => [
          ...prev,
          { text: COMPLAINT_AFTER_DETAIL, isUser: false, timestamp: new Date() },
        ]);

        setTimeout(() => {
          handleComplaintRedirect(detail);
        }, 1000);
        return;
      }

      if (awaitingCity) {
        setShowRedirectPill(false);
        setAwaitingCity(false);
        const location = classifyLocation(text);
        let reply: string;
        const redirect = true;

        switch (location.type) {
          case 'bahia':
            reply =
              'Itaberaba ou região, perfeito! Nossa matriz fica em Itaberaba e também temos unidade em Salvador/BA. Já vou te direcionar para um especialista! :D';
            break;
          case 'sp':
            reply =
              'São Paulo, que ótimo! Temos unidade aí também. Vou te direcionar para o nosso atendente de São Paulo, tá bom? :D';
            break;
          case 'foreign':
            reply =
              'Como sua localização é fora do Brasil, nosso atendimento é feito exclusivamente de forma online. Posso te direcionar para um especialista assim mesmo, quer? :D';
            break;
          default:
            reply =
              'Entendi! Vou te direcionar para um dos nossos especialistas, que vão verificar a melhor forma de te atender, levando em conta as cidades próximas. Um momentinho! :)';
            break;
        }

        setChatMessages((prev) => [...prev, { text: reply, isUser: false, timestamp: new Date() }]);
        if (redirect) setShowRedirectPill(true);
        return;
      }

      const rule = CHAT_RULES.find((r) => r.keywords.some((k) => normalize(text).includes(normalize(k))));

      let botReply: string;
      let shouldRedirect = false;

      if (rule) {
        botReply = rule.reply;
        shouldRedirect = rule.redirect;
        if (rule.awaitComplaintDetail) {
          setAwaitingComplaintDetail(true);
          setShowRedirectPill(false);
        }
      } else {
        botReply = FALLBACK_ASK_CITY;
        setAwaitingCity(true);
        setShowRedirectPill(false);
      }

      setChatMessages((prev) => [...prev, { text: botReply, isUser: false, timestamp: new Date() }]);
      if (shouldRedirect) setShowRedirectPill(true);
      else setShowRedirectPill(false);
    }, 1200 + Math.random() * 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = () => {
    setShowQuickReply(false);
    setChatMessages((prev) => [...prev, { text: 'Quero tirar uma dúvida', isUser: true, timestamp: new Date() }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        { text: 'Claro! Pode me contar qual é a sua dúvida, vou te ajudar no que puder! :)', isUser: false, timestamp: new Date() },
      ]);
    }, 1200 + Math.random() * 800);
  };

  const handleWhatsAppRedirect = () => {
    const message = encodeURIComponent(
      'Olá, Grupo Orcoma! Gostaria de falar com um especialista em contabilidade e assessoria.'
    );
    window.open(`https://wa.me/5575999882400?text=${message}`, '_blank');
  };

  const handleComplaintRedirect = (detail: string) => {
    const message = encodeURIComponent(
      `[Relato de cliente via chat]\n\n"${detail}"\n\nEncaminhado pela Ana - Atendente Virtual.`
    );
    window.open(`https://wa.me/5575999882400?text=${message}`, '_blank');
  };

  const handleRedirectPill = () => {
    setShowRedirectPill(false);
    setChatMessages((prev) => [
      ...prev,
      { text: 'Claro! Me envie a um especialista', isUser: true, timestamp: new Date() },
    ]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setChatMessages((prev) => [
        ...prev,
        { text: 'Perfeito! Já vou te conectar com um especialista. Um momentinho... :D', isUser: false, timestamp: new Date() },
      ]);
      handleWhatsAppRedirect();
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
          {/* Balão de mensagens rotativas (estado fechado) */}
      {!isOpen && chatMessages.length === 0 && (
        <div
          className="hidden sm:block absolute bottom-[70px] right-0 w-72"
          style={{ animation: 'fadeInUp 0.4s ease-out' }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-3xl transition-shadow duration-300"
            onClick={handleOpenChat}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleOpenChat()}
          >
            {/* Cabeçalho */}
            <div className="bg-[#050550] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                C
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">Ana</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" style={{ animation: 'blink 1.4s ease-in-out infinite' }} />
                  <span className="text-emerald-300 text-xs">online</span>
                </div>
              </div>
            </div>

            {/* Mensagem rotativa */}
            <div className="px-4 py-4 min-h-[80px] flex items-center">
              <p
                className="text-gray-700 text-sm leading-relaxed transition-opacity duration-300"
                style={{ opacity: isFading ? 0 : 1 }}
              >
                {ROTATING_MESSAGES[messageIndex]}
              </p>
            </div>
          </div>

          {/* Seta do balão */}
          <div className="absolute -bottom-2 right-7 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45 shadow-lg" />
        </div>
      )}

      {/* Janela de chat aberta */}
      {isOpen && (
        <div
          className="absolute bottom-[70px] right-0 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: 'min(480px, calc(100vh - 120px))', animation: 'fadeInUp 0.3s ease-out' }}
        >
          {/* Header do chat */}
          <div className="bg-[#050550] px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              C
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Ana</p>
              <p className="text-emerald-300 text-xs">Atendente Virtual</p>
            </div>
            <button
              type="button"
              onClick={handleCloseChat}
              className="text-gray-300 hover:text-white transition-colors text-lg leading-none p-1"
              aria-label="Fechar chat"
            >
              ✕
            </button>
          </div>

          {/* Área de mensagens */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.isUser
                      ? 'bg-[#050550] text-white rounded-2xl rounded-br-md'
                      : 'bg-white text-gray-700 rounded-2xl rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'blink 1s ease-in-out 0s infinite' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'blink 1s ease-in-out 0.2s infinite' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: 'blink 1s ease-in-out 0.4s infinite' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />

            {showRedirectPill && (
              <div className="flex justify-start" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                <button
                  type="button"
                  onClick={handleRedirectPill}
                  className="flex items-center gap-2 border border-emerald-500 text-emerald-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors duration-200"
                >
                  <span className="border-2 border-emerald-500 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  </span>
                  Claro! Me envie a um especialista
                </button>
              </div>
            )}
          </div>

          {/* Quick reply */}
          {showQuickReply && (
            <div className="px-4 pt-2 pb-1 bg-gray-50 shrink-0" style={{ animation: 'fadeInUp 0.3s ease-out' }}>
              <button
                type="button"
                onClick={handleQuickReply}
                className="max-w-full flex items-center gap-2 border border-emerald-500 text-emerald-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors duration-200"
              >
                <span className="border-2 border-emerald-500 rounded-full w-4 h-4 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </span>
                Quero tirar uma dúvida
              </button>
            </div>
          )}

          {/* Botão falar no WhatsApp */}
          <div className="px-4 pt-3 pb-1 bg-gray-50 border-t border-gray-100 shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppRedirect}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors duration-200"
            >
              <i className="fa-brands fa-whatsapp text-lg" />
              Falar com especialista no WhatsApp
            </button>
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-400/50 transition-shadow"
            />
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-full bg-[#050550] hover:bg-[#0a0a6a] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all duration-200 shrink-0"
              aria-label="Enviar mensagem"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

          {/* Seta do chat */}
          <div className="absolute -bottom-2 right-7 w-4 h-4 bg-white border-r border-b border-gray-200 transform rotate-45" />
        </div>
      )}

      {/* Botão WhatsApp */}
      <button
        type="button"
        id="whatsapp-floating-btn"
        onClick={isOpen ? undefined : handleOpenChat}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center text-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-110 active:scale-95 relative"
        aria-label="Conversar no WhatsApp"
      >
        <i className="fa-brands fa-whatsapp" />
        <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-yellow-400 border-2 border-emerald-500" />
        </span>
      </button>
    </div>
  );
};
