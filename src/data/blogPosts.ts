export interface BlogPost {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string[];
  date: string;
  dateIso: string;
  readTime: string;
  author: string;
  image?: string | null;
}

export const blogPosts: BlogPost[] = [
  {
    id: 'obrigacoes-fiscais',
    slug: 'obrigacoes-fiscais',
    category: 'Fiscal',
    title: 'Obrigações fiscais que toda empresa deve acompanhar',
    subtitle: 'Entenda as principais obrigações fiscais e evite multas com uma rotina contábil bem organizada.',
    excerpt:
      'Manter as obrigações fiscais em dia é um dos maiores desafios de qualquer empresa. Saiba quais são as principais e como se organizar.',
    content: [
      'Manter as obrigações fiscais em dia é um dos maiores desafios de qualquer empresa, independentemente do porte. O atraso ou a falta de entrega pode gerar multas, juros e até problemas com os órgãos reguladores.',
      'As principais obrigações envolvem o envio de declarações como a DCTF, EFD-Reinf, SPED Fiscal e ECD. Cada uma tem prazos e periodicidades específicas que precisam estar no calendário do departamento contábil.',
      'Uma rotina organizada, com um calendário fiscal bem definido e revisões periódicas, reduz drasticamente o risco de penalidades e traz mais previsibilidade para o caixa da empresa.',
      'Contar com uma assessoria contábil especializada é a forma mais segura de garantir que nenhuma obrigação seja esquecida e que os tributos sejam pagos da forma mais eficiente possível.',
    ],
    date: '12 fev 2026',
    dateIso: '2026-02-12',
    readTime: '6 min',
    author: 'Equipe Orcoma',
  },
  {
    id: 'organizar-contabilidade',
    slug: 'organizar-contabilidade',
    category: 'Gestão',
    title: '5 dicas para organizar a contabilidade do seu negócio',
    subtitle: 'Pequenas mudanças na rotina podem trazer muito mais clareza e segurança para a sua gestão.',
    excerpt:
      'Organização é a base de uma contabilidade saudável. Confira cinco práticas simples que fazem toda a diferença na rotina da sua empresa.',
    content: [
      'A organização contábil não precisa ser um bicho de sete cabeças. Com algumas práticas simples, é possível manter tudo em dia e ainda ganhar tempo na gestão.',
      'A primeira dica é separar as finanças pessoais das empresariais. Uma conta PJ própria é o primeiro passo para um controle financeiro confiável.',
      'A segunda é guardar todos os comprovantes e notas fiscais de forma digital e organizada. Isso facilita a apuração de impostos e o lançamento correto das despesas.',
      'Além disso, mantenha um fluxo de caixa atualizado, faça conciliação bancária mensal e, claro, conte com uma assessoria contábil que te oriente na tomada de decisões.',
    ],
    date: '05 fev 2026',
    dateIso: '2026-02-05',
    readTime: '4 min',
    author: 'Equipe Orcoma',
  },
  {
    id: 'contabilidade-publica-gestor',
    slug: 'contabilidade-publica-gestor',
    category: 'Público',
    title: 'Contabilidade pública: o que muda para o gestor',
    subtitle: 'Saiba como a contabilidade pública auxilia na transparência e na tomada de decisões.',
    excerpt:
      'A contabilidade pública vai muito além da burocracia. Ela é uma ferramenta essencial de transparência e gestão para os administradores públicos.',
    content: [
      'A contabilidade pública é o instrumento que registra, controla e demonstra a execução orçamentária, financeira e patrimonial dos entes públicos.',
      'Para o gestor, ela representa uma fonte de informação estratégica, permitindo acompanhar a arrecadação, os gastos e a conformidade com a legislação.',
      'A transparência é outro ponto central: demonstrações contábeis claras geram confiança para a população e para os órgãos de controle.',
      'Especialistas em contabilidade pública, como a equipe da Orcoma, garantem que todo o processo atenda às exigências legais com ética e eficiência.',
    ],
    date: '28 jan 2026',
    dateIso: '2026-01-28',
    readTime: '7 min',
    author: 'Equipe Orcoma',
  },
  {
    id: 'planejar-impostos',
    slug: 'planejar-impostos',
    category: 'Planejamento',
    title: 'Como planejar o pagamento de impostos em 2026',
    subtitle: 'Um bom planejamento tributário reduz custos e evita surpresas no fim do exercício.',
    excerpt:
      'O planejamento tributário é a diferença entre pagar mais ou menos impostos de forma legal. Veja como se preparar para 2026.',
    content: [
      'O planejamento tributário é um conjunto de estratégias legais para reduzir a carga de impostos de uma empresa, aproveitando benefícios e regimes fiscais adequados.',
      'O primeiro passo é analisar qual o regime tributário mais vantajoso: Simples Nacional, Lucro Presumido ou Lucro Real. Cada um tem suas particularidades.',
      'Além disso, é importante acompanhar incentivos fiscais, créditos de PIS/COFINS e a possibilidade de compensação de tributos.',
      'Um escritório contábil especializado auxilia na estruturação do planejamento, garantindo economia sem riscos de autuações.',
    ],
    date: '20 jan 2026',
    dateIso: '2026-01-20',
    readTime: '5 min',
    author: 'Equipe Orcoma',
  },
  {
    id: 'assessoria-contabil-pmes',
    slug: 'assessoria-contabil-pmes',
    category: 'Assessoria',
    title: 'A importância da assessoria contábil para PMEs',
    subtitle: 'A assessoria vai além da burocracia e se torna uma aliada estratégica do crescimento.',
    excerpt:
      'Para as pequenas e médias empresas, a assessoria contábil é um parceiro estratégico que ajuda a crescer com segurança.',
    content: [
      'Muitas empresas enxergam a contabilidade apenas como uma obrigação. Na prática, uma boa assessoria contábil é uma aliada estratégica do crescimento.',
      'Além de manter os livros e obrigações em dia, o assessor auxilia na análise de indicadores, na precificação e na tomada de decisões financeiras.',
      'Para as PMEs, que geralmente têm menos estrutura, essa orientação faz uma diferença enorme na saúde do negócio.',
      'Com a Orcoma, sua empresa conta com profissionais que entendem as peculiaridades de cada porte e segmento, oferecendo soluções sob medida.',
    ],
    date: '13 jan 2026',
    dateIso: '2026-01-13',
    readTime: '5 min',
    author: 'Equipe Orcoma',
  },
  {
    id: 'folha-de-pagamento',
    slug: 'folha-de-pagamento',
    category: 'RH / DP',
    title: 'Folha de pagamento descomplicada do início ao fim',
    subtitle: 'Passo a passo para manter a folha em dia, com encargos corretos e sem dores de cabeça.',
    excerpt:
      'A folha de pagamento exige atenção a muitos detalhes. Entenda o passo a passo para evitar erros e retrabalho.',
    content: [
      'A folha de pagamento é uma das rotinas mais delicadas do departamento pessoal, pois envolve remuneração, encargos e obrigações trabalhistas.',
      'O processo inclui o cálculo de salários, horas extras, adicionais, INSS, IRRF e o depósito do FGTS dentro dos prazos legais.',
      'Erros nesse processo podem gerar passivos trabalhistas e multas. Por isso, a atualização constante com a legislação é essencial.',
      'Uma equipe especializada em departamento pessoal garante que a folha seja processada com precisão e dentro do prazo, todos os meses.',
    ],
    date: '06 jan 2026',
    dateIso: '2026-01-06',
    readTime: '8 min',
    author: 'Equipe Orcoma',
  },
  {
    id: 'obrigacoes-acessorias',
    slug: 'obrigacoes-acessorias',
    category: 'Fiscal',
    title: 'Obrigações acessórias: o que são e como não se atrasar',
    subtitle: 'Conheça as declarações enviadas às autoridades e monte um calendário eficiente.',
    excerpt:
      'As obrigações acessórias são as declarações que a empresa deve enviar aos órgãos. Saiba quais são as principais e como se organizar.',
    content: [
      'Obrigações acessórias são declarações que as empresas precisam enviar aos órgãos fiscais, como a DCTF, o SPED Fiscal e a ECD.',
      'Elas servem para que o fisco conheça a situação tributária da empresa e cruzem informações automaticamente.',
      'O atraso ou a falta de entrega dessas declarações gera multas que podem ser evitadas com um calendário fiscal bem estruturado.',
      'Ter um escritório contábil que gerencia essas entregas é a forma mais simples de nunca se atrasar.',
    ],
    date: '30 dez 2025',
    dateIso: '2025-12-30',
    readTime: '6 min',
    author: 'Equipe Orcoma',
  },
  {
    id: 'abrir-empresa',
    slug: 'abrir-empresa',
    category: 'Empresarial',
    title: 'Abertura de empresa: guia prático para começar',
    subtitle: 'Do planejamento à formalização, saiba os passos essenciais para abrir o seu CNPJ.',
    excerpt:
      'Abrir uma empresa é um grande passo. Entenda o passo a passo, do planejamento ao registro, para começar com o pé direito.',
    content: [
      'Abrir uma empresa vai muito além do registro do CNPJ. É preciso planejamento, definição do regime tributário e escolha da atividade.',
      'Os primeiros passos envolvem a definição do contrato social, a pesquisa do enquadramento adequado e a obtenção das licenças necessárias.',
      'A escolha entre Simples Nacional, Lucro Presumido e Lucro Real impacta diretamente nos tributos a pagar.',
      'Com o apoio de uma assessoria contábil, todo o processo de abertura se torna mais rápido e seguro, evitando retrabalho.',
    ],
    date: '22 dez 2025',
    dateIso: '2025-12-22',
    readTime: '9 min',
    author: 'Equipe Orcoma',
  },
  {
    id: 'beneficios-fiscais-nordeste',
    slug: 'beneficios-fiscais-nordeste',
    category: 'Planejamento',
    title: 'Benefícios fiscais regionais: oportunidades para o seu negócio',
    subtitle: 'Incentivos fiscais do Nordeste podem reduzir a carga tributária de empresas instaladas na região.',
    excerpt:
      'Programas de incentivo regional oferecem redução de tributos. Saiba como aproveitar essas oportunidades de forma legal.',
    content: [
      'O Nordeste possui programas de incentivo fiscal que reduzem significativamente a carga tributária de empresas instaladas na região.',
      'Esses benefícios são uma excelente oportunidade para reduzir custos e tornar o negócio mais competitivo.',
      'É importante conhecer os requisitos e manter a documentação em dia para não perder o benefício ou gerar autuações.',
      'A Orcoma, com atuação na Bahia, auxilia empresas a identificarem e aproveitarem esses incentivos com segurança.',
    ],
    date: '15 dez 2025',
    dateIso: '2025-12-15',
    readTime: '6 min',
    author: 'Equipe Orcoma',
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
