import React, { useState, useEffect } from 'react';
import { Reveal } from './Reveal';

interface BlogPost {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  image?: string | null;
}

const blogPosts: BlogPost[] = [
  {
    id: 'obrigacoes-fiscais',
    category: 'Fiscal',
    title: 'Obrigações fiscais que toda empresa deve acompanhar',
    subtitle: 'Entenda as principais obrigações fiscais e evite multas com uma rotina contábil bem organizada.',
    date: '12 fev 2026',
    readTime: '6 min',
  },
  {
    id: 'organizar-contabilidade',
    category: 'Gestão',
    title: '5 dicas para organizar a contabilidade do seu negócio',
    subtitle: 'Pequenas mudanças na rotina podem trazer muito mais clareza e segurança para a sua gestão.',
    date: '05 fev 2026',
    readTime: '4 min',
  },
  {
    id: 'contabilidade-publica-gestor',
    category: 'Público',
    title: 'Contabilidade pública: o que muda para o gestor',
    subtitle: 'Saiba como a contabilidade pública auxilia na transparência e na tomada de decisões.',
    date: '28 jan 2026',
    readTime: '7 min',
  },
  {
    id: 'planejar-impostos',
    category: 'Planejamento',
    title: 'Como planejar o pagamento de impostos em 2026',
    subtitle: 'Um bom planejamento tributário reduz custos e evita surpresas no fim do exercício.',
    date: '20 jan 2026',
    readTime: '5 min',
  },
  {
    id: 'assessoria-contabil-pmes',
    category: 'Assessoria',
    title: 'A importância da assessoria contábil para PMEs',
    subtitle: 'A assessoria vai além da burocracia e se torna uma aliada estratégica do crescimento.',
    date: '13 jan 2026',
    readTime: '5 min',
  },
  {
    id: 'folha-de-pagamento',
    category: 'RH / DP',
    title: 'Folha de pagamento descomplicada do início ao fim',
    subtitle: 'Passo a passo para manter a folha em dia, com encargos corretos e sem dores de cabeça.',
    date: '06 jan 2026',
    readTime: '8 min',
  },
  {
    id: 'obrigacoes-acessorias',
    category: 'Fiscal',
    title: 'Obrigações acessórias: o que são e como não se atrasar',
    subtitle: 'Conheça as declarações enviadas às autoridades e monte um calendário eficiente.',
    date: '30 dez 2025',
    readTime: '6 min',
  },
  {
    id: 'abrir-empresa',
    category: 'Empresarial',
    title: 'Abertura de empresa: guia prático para começar',
    subtitle: 'Do planejamento à formalização, saiba os passos essenciais para abrir o seu CNPJ.',
    date: '22 dez 2025',
    readTime: '9 min',
  },
];

const NewspaperIcon = () => (
  <i className="fa-solid fa-newspaper text-yellow-400 text-5xl"></i>
);

export const Blog: React.FC<{ onOpenBlog?: () => void; onOpenPost?: (slug: string) => void }> = ({
  onOpenBlog,
  onOpenPost,
}) => {
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts);

  // Carrega os posts da API quando disponível; senão mantém o fallback estático.
  useEffect(() => {
    let active = true;
    fetch('/api/posts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.posts?.length) setPosts(data.posts);
      })
      .catch(() => {
        /* API offline: mantém blogPosts */
      });
    return () => {
      active = false;
    };
  }, []);

  const visiblePosts = posts.slice(0, 6);

  return (
    <section id="blog" className="bg-[#07073b] text-white py-20 lg:py-28 relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Cabeçalho */}
        <Reveal>
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block text-sm sm:text-base font-extrabold text-yellow-500 uppercase tracking-widest">
              Confira nosso blog
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mt-4 max-w-3xl mx-auto">
              Conteúdos práticos e estratégicos para orientar decisões, melhorar a gestão e ajudar sua empresa a crescer com mais segurança.
            </h2>

            {/* Pill Ver todos os artigos */}
            <div className="mt-8">
              <button
                type="button"
                onClick={onOpenBlog}
                className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-[#07073b] text-sm sm:text-base font-extrabold px-7 py-3 rounded-full shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 uppercase tracking-wider"
              >
                <i className="fa-solid fa-book-open"></i>
                Ver todos os artigos
              </button>
            </div>
          </div>
        </Reveal>

        {/* Grade de artigos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visiblePosts.map((post, index) => (
            <Reveal key={post.id} delay={Math.min((index % 3) * 0.1, 0.2)} y={24}>
              <a
                href="#blog"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenPost?.(post.id);
                }}
                className="group block bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                {/* Foto do post (ou placeholder) */}
                <div className="h-44 relative overflow-hidden">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-44 bg-slate-200 flex items-center justify-center relative">
                      <NewspaperIcon />
                      <span className="absolute inset-0 bg-slate-300/30 group-hover:bg-transparent transition-colors duration-300"></span>
                    </div>
                  )}
                </div>

                {/* Corpo */}
                <div className="p-6 text-left">
                  <span className="text-xs font-extrabold text-yellow-500 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#07075c] leading-snug mt-2 group-hover:text-[#0c0ccc] transition-colors duration-200">
                    {post.title}
                  </h3>

                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-regular fa-calendar"></i>
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fa-regular fa-clock"></i>
                      {post.readTime}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mt-3">
                    {post.subtitle}
                  </p>

                  <span className="inline-flex items-center gap-2 text-sm font-bold text-[#0c0ccc] group-hover:text-yellow-500 transition-colors duration-200 mt-4">
                    Ler mais
                    <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform duration-200"></i>
                  </span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
