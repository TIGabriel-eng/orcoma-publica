import React, { useState, useMemo, useEffect } from 'react';
import { Reveal } from './Reveal';
import { blogPosts, BlogPost } from '../data/blogPosts';

interface BlogPageProps {
  onBack: () => void;
  onOpenPost: (slug: string) => void;
}

const NewspaperPlaceholder: React.FC<{ heightClass?: string }> = ({ heightClass = 'h-44' }) => (
  <div className={`${heightClass} bg-slate-200 flex items-center justify-center overflow-hidden`}>
    <i className="fa-solid fa-newspaper text-yellow-400 text-5xl"></i>
  </div>
);

const SaibaMaisPill: React.FC = () => (
  <span className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-extrabold px-4 py-2 rounded-full uppercase tracking-wider transition-colors duration-200">
    Saiba mais
    <i className="fa-solid fa-arrow-right"></i>
  </span>
);

const BlogCard: React.FC<{ post: BlogPost; big?: boolean; onClick: () => void }> = ({
  post,
  big = false,
  onClick,
}) => {
  if (big) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="text-left w-full bg-white rounded-2xl border border-[#E9E9F2] shadow-[0_4px_20px_rgba(9,36,167,0.08)] overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
      >
        <div className="md:flex md:flex-row">
          <div className="md:w-1/2 min-h-[260px]">
            {post.image ? (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full min-h-[200px] md:min-h-[260px] object-cover"
              />
            ) : (
              <NewspaperPlaceholder heightClass="h-full min-h-[200px] md:min-h-[260px]" />
            )}
          </div>
          <div className="p-6 md:w-1/2 flex flex-col justify-center">
            <span className="text-xs font-extrabold text-yellow-500 uppercase tracking-wider">
              {post.category}
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#12122B] leading-tight mt-2 group-hover:text-[#e8b800] transition-colors duration-200">
              {post.title}
            </h3>
            <div className="flex items-center gap-4 mt-3 text-xs text-[#6B6B85]">
              <span className="flex items-center gap-1.5">
                <i className="fa-regular fa-calendar"></i>
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <i className="fa-regular fa-clock"></i>
                {post.readTime}
              </span>
            </div>
            <p className="text-sm text-[#6B6B85] leading-relaxed mt-3">{post.excerpt}</p>
            <div className="mt-4">
              <SaibaMaisPill />
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full bg-white rounded-2xl border border-[#E9E9F2] shadow-[0_4px_20px_rgba(9,36,167,0.08)] overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="h-44 overflow-hidden">
        {post.image ? (
          <img src={post.image} alt={post.title} className="h-44 w-full object-cover" />
        ) : (
          <NewspaperPlaceholder heightClass="h-44" />
        )}
      </div>
      <div className="p-6">
        <span className="text-xs font-extrabold text-yellow-500 uppercase tracking-wider">
          {post.category}
        </span>
        <h3 className="text-lg font-extrabold text-[#12122B] leading-snug mt-2 group-hover:text-[#e8b800] transition-colors duration-200">
          {post.title}
        </h3>
        <div className="flex items-center gap-4 mt-3 text-xs text-[#6B6B85]">
          <span className="flex items-center gap-1.5">
            <i className="fa-regular fa-calendar"></i>
            {post.date}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="fa-regular fa-clock"></i>
            {post.readTime}
          </span>
        </div>
        <p className="text-sm text-[#6B6B85] leading-relaxed mt-3">{post.excerpt}</p>
        <div className="mt-4">
          <SaibaMaisPill />
        </div>
      </div>
    </button>
  );
};

const SidebarCTA: React.FC<{
  title: string;
  pillText: string;
  pillClass: string;
  icon: string;
  href: string;
}> = ({ title, pillText, pillClass, icon, href }) => (
  <div className="bg-white rounded-2xl border border-[#E9E9F2] shadow-[0_4px_20px_rgba(9,36,167,0.08)] overflow-hidden">
    <div className="bg-orcoma-gradient px-5 py-8 flex flex-col items-center text-center text-white">
      <img
        src="/grupo-orcoma-logo.png"
        alt="Grupo Orcoma"
        className="w-28 h-auto object-contain mb-5"
      />
      <p className="text-lg font-extrabold leading-snug">{title}</p>
    </div>
    <div className="p-5 text-center">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`inline-flex items-center gap-2 text-white text-sm font-extrabold px-5 py-2.5 rounded-full ${pillClass} transition-transform duration-200 hover:scale-105`}
      >
        <i className={`fa-solid ${icon}`}></i>
        {pillText}
      </a>
    </div>
  </div>
);

const NewsletterBanner: React.FC = () => {
  const [nome, setNome] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-orcoma-gradient rounded-3xl px-8 py-12 text-center text-white shadow-[0_20px_60px_rgba(9,36,167,0.25)]">
          <i className="fa-solid fa-circle-check text-yellow-400 text-5xl mb-4"></i>
          <h2 className="text-2xl sm:text-3xl font-extrabold">Inscrição confirmada!</h2>
          <p className="mt-2 text-white/80 max-w-xl mx-auto">
            Obrigada, {nome || 'você'}! Em breve você receberá nossas novidades por e-mail. :)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className="bg-orcoma-gradient rounded-3xl px-6 sm:px-10 py-12 shadow-[0_20px_60px_rgba(9,36,167,0.25)]">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <span className="inline-flex items-center gap-2 bg-white/10 text-yellow-400 text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full border border-yellow-400/40">
              <i className="fa-solid fa-envelope"></i>
              Newsletter
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-4">
              Assine nossa newsletter e fique por dentro de todas as novidades!
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg space-y-3">
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              className="w-full bg-slate-100 rounded-full px-5 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            />
            <input
              type="tel"
              required
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              placeholder="Celular"
              className="w-full bg-slate-100 rounded-full px-5 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="w-full bg-slate-100 rounded-full px-5 py-3 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-yellow-400 transition-shadow"
            />
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-extrabold py-3 rounded-full uppercase tracking-wider transition-colors duration-200"
            >
              Assinar!
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const BlogPage: React.FC<BlogPageProps> = ({ onBack, onOpenPost }) => {
  const [search, setSearch] = useState('');
  const [showNews, setShowNews] = useState(false);
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

  const filteredPosts = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = posts;
    if (term) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.subtitle.toLowerCase().includes(term) ||
          p.excerpt.toLowerCase().includes(term)
      );
    }
    if (showNews) {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      list = list.filter((p) => new Date(p.dateIso + 'T00:00:00').getTime() >= thirtyDaysAgo);
    }
    return list;
  }, [search, showNews, posts]);

  const [featured, ...rest] = filteredPosts;

  return (
    <div className="min-h-screen bg-[#F6F6FB] text-slate-800">
      {/* Hero */}
      <section className="relative bg-orcoma-gradient text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <Reveal>
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 bg-white/10 text-yellow-400 text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full border border-yellow-400/40">
                <i className="fa-solid fa-newspaper"></i>
                Blog Grupo Orcoma
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mt-5 max-w-3xl">
                Conteúdo que apoia decisões mais seguras
              </h1>
              <p className="mt-4 text-white/85 max-w-2xl">
                Conteúdos práticos e estratégicos para orientar decisões, melhorar a gestão e ajudar
                sua empresa a crescer com mais segurança.
              </p>

              <div className="mt-8 w-full max-w-xl">
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-5 top-1/2 -translate-y-1/2 text-white/60"></i>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar artigos..."
                    className="w-full bg-white/15 border border-white/25 rounded-full pl-12 pr-5 py-3.5 text-sm text-white placeholder:text-white/60 outline-none focus:ring-2 focus:ring-yellow-400/60 backdrop-blur-sm transition-shadow"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter bar */}
        <div className="flex items-center gap-3 -mt-6 relative z-10 pb-8">
          <button
            type="button"
            onClick={() => setShowNews((v) => !v)}
            className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition-colors duration-200 ${
              showNews
                ? 'bg-[#0924a7] text-white'
                : 'bg-white text-[#12122B] border border-[#E9E9F2] hover:bg-slate-50'
            }`}
          >
            <i className="fa-solid fa-sparkles"></i>
            Novidades
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_280px] lg:gap-12 pb-16">
          {/* Posts */}
          <div>
            {filteredPosts.length === 0 ? (
              <div className="py-20 text-center">
                <i className="fa-solid fa-file-circle-question text-5xl text-[#6B6B85]/40 mb-4"></i>
                <p className="text-xl font-extrabold text-[#12122B]">Nenhum artigo encontrado.</p>
                <p className="text-[#6B6B85] mt-1">Tente outra busca.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {featured && (
                  <div className="pb-6">
                    <BlogCard post={featured} big onClick={() => onOpenPost(featured.slug)} />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {rest.map((post) => (
                    <BlogCard key={post.id} post={post} onClick={() => onOpenPost(post.slug)} />
                  ))}
                </div>
              </div>
            )}

            <div className="text-center pt-10">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 bg-[#0924a7] text-white text-sm font-extrabold px-6 py-3 rounded-full uppercase tracking-wider hover:bg-[#0c0ccc] transition-colors duration-200"
              >
                <i className="fa-solid fa-arrow-left"></i>
                Voltar para a Home
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 space-y-6 self-start">
            <SidebarCTA
              title="Venha abrir a sua empresa agora!"
              pillText="Fale Conosco"
              pillClass="bg-yellow-400 hover:bg-yellow-500 text-black"
              icon="fa-comments"
              href="https://wa.me/5575999882400?text=Ol%C3%A1%2C%20gostaria%20de%20abrir%20a%20minha%20empresa!"
            />
            <SidebarCTA
              title="Chega de dor de cabeça: trocar de contabilidade ficou simples"
              pillText="Quero ir para a ORCOMA!!"
              pillClass="bg-emerald-500 hover:bg-emerald-600 text-white"
              icon="fa-right-to-bracket"
              href="https://wa.me/5575999882400?text=Ol%C3%A1%2C%20quero%20trocar%20de%20contabilidade!"
            />
          </aside>
        </div>
      </div>

      {/* Newsletter */}
      <NewsletterBanner />
    </div>
  );
};
