import React, { useState, useEffect, useMemo } from 'react';
import { Reveal } from './Reveal';
import { getPostBySlug, BlogPost } from '../data/blogPosts';

interface BlogPostPageProps {
  slug: string;
  onBack: () => void;
}

interface TocItem {
  id: string;
  label: string;
}

const HEADER_OFFSET = 96;

function buildToc(content: string[]): TocItem[] {
  const items: TocItem[] = [];
  content.forEach((block, index) => {
    const h2Match = block.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (h2Match) {
      const text = h2Match[1].replace(/<[^>]*>/g, '').trim();
      if (text) {
        items.push({ id: `artigo-topico-${index + 1}`, label: text });
      }
    }
  });
  // Fallback: se nenhum <h2> existe, usa todos os blocos (posts antigos)
  if (items.length === 0) {
    content.forEach((paragraph, index) => {
      items.push({ id: `artigo-topico-${index + 1}`, label: labelFromParagraph(paragraph) });
    });
  }
  return items;
}

function labelFromParagraph(paragraph: string): string {
  const stripped = paragraph.replace(/<[^>]*>/g, '').trim();
  const firstSentence = stripped.split(/(?<=[.!?])\s+/)[0] ?? stripped;
  const trimmed = firstSentence.trim();
  return trimmed.length > 70 ? `${trimmed.slice(0, 70).trimEnd()}...` : trimmed;
}

const TocList: React.FC<{
  toc: TocItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
}> = ({ toc, activeId, onSelect }) => (
  <nav className="space-y-1">
    {toc.map((item, index) => {
      const active = activeId === item.id;
      return (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`w-full text-left flex items-start gap-3 px-3 py-2 rounded-xl text-sm leading-snug transition-colors duration-200 ${
            active ? 'bg-[#0924a7]/[0.06] text-[#0924a7] font-bold' : 'text-[#4b4b63] hover:bg-slate-50 hover:text-[#12122B]'
          }`}
        >
          <span
            className={`flex-none flex items-center justify-center w-5 h-5 mt-0.5 rounded-full text-[11px] font-extrabold ${
              active ? 'bg-[#0924a7] text-white' : 'bg-slate-200 text-[#6B6B85]'
            }`}
          >
            {index + 1}
          </span>
          <span className="min-w-0">{item.label}</span>
        </button>
      );
    })}
  </nav>
);

const TocHeader: React.FC = () => (
  <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#12122B] mb-4">
    <i className="fa-solid fa-list-ul text-yellow-500"></i>
    Índice deste artigo
  </p>
);

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onBack }) => {
  const [post, setPost] = useState<BlogPost | undefined>(() => getPostBySlug(slug));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  // Busca o post na API quando disponível; senão mantém o fallback estático.
  useEffect(() => {
    let active = true;
    fetch(`/api/posts/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.post) setPost(data.post);
      })
      .catch(() => {
        /* API offline: mantém o post estático */
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const toc = useMemo(() => (post ? buildToc(post.content) : []), [post]);

  // Destaca no índice o tópico visível na tela.
  useEffect(() => {
    if (!post || toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [post, toc]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
    if (window.innerWidth < 1024) setMobileTocOpen(false);
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F6F6FB] flex flex-col items-center justify-center text-center px-6 py-20">
        <i className="fa-solid fa-file-circle-xmark text-6xl text-[#6B6B85]/40 mb-6"></i>
        <h1 className="text-3xl font-extrabold text-[#12122B]">Artigo não encontrado</h1>
        <p className="text-[#6B6B85] mt-2 max-w-md">
          O artigo que você procura não está disponível ou foi removido.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-[#0924a7] text-white text-sm font-extrabold px-6 py-3 rounded-full uppercase tracking-wider mt-6 hover:bg-[#0c0ccc] transition-colors duration-200"
        >
          <i className="fa-solid fa-arrow-left"></i>
          Voltar para o Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F6FB] text-slate-800">
      {/* Hero */}
      <section className="relative bg-orcoma-gradient text-white overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-yellow-400/20 blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 relative z-10">
          <Reveal>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-bold transition-colors"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Voltar para o Blog
            </button>

            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/85">
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-calendar"></i>
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-user"></i>
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <i className="fa-regular fa-clock"></i>
                {post.readTime} de leitura
              </span>
              <span className="inline-flex items-center bg-white/10 text-yellow-400 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-yellow-400/40">
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-4 leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-white/85 text-lg">{post.subtitle}</p>
          </Reveal>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10 items-start">
          {/* Índice (desktop) */}
          <aside className="hidden lg:block lg:sticky lg:top-24 pt-8">
            <div className="bg-white rounded-2xl border border-[#E9E9F2] shadow-[0_4px_20px_rgba(9,36,167,0.08)] p-5">
              <TocHeader />
              <TocList toc={toc} activeId={activeId} onSelect={scrollToSection} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Índice (mobile) */}
            <div className="lg:hidden mt-8">
              <div className="bg-white rounded-2xl border border-[#E9E9F2] shadow-[0_4px_20px_rgba(9,36,167,0.08)]">
                <button
                  type="button"
                  onClick={() => setMobileTocOpen((v) => !v)}
                  className="w-full flex items-center justify-between p-5"
                >
                  <TocHeader />
                  <i
                    className={`fa-solid ${mobileTocOpen ? 'fa-chevron-up' : 'fa-chevron-down'} text-[#6B6B85]`}
                  ></i>
                </button>
                {mobileTocOpen && (
                  <div className="px-3 pb-3">
                    <TocList toc={toc} activeId={activeId} onSelect={scrollToSection} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(9,36,167,0.12)] p-6 sm:p-10 mt-8">
              <div className="h-64 sm:h-80 rounded-2xl flex items-center justify-center overflow-hidden mb-8 bg-slate-200">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                  <i className="fa-solid fa-newspaper text-yellow-400 text-7xl"></i>
                )}
              </div>

              <div className="rich-content space-y-4 text-[1.0625rem] text-[#4b4b63] leading-relaxed">
                {post.content.map((block, index) => {
                  const html = String(block ?? '');
                  const isHtml = /^<[a-z]/i.test(html.trim());
                  return (
                    <div
                      key={index}
                      id={`artigo-topico-${index + 1}`}
                      className="scroll-mt-24"
                      dangerouslySetInnerHTML={{ __html: isHtml ? html : `<p>${html}</p>` }}
                    />
                  );
                })}
              </div>

              <div className="flex items-center gap-3 pt-8 mt-8 border-t border-slate-100">
                <div className="w-12 h-12 rounded-full bg-[#0c0ccc] text-white flex items-center justify-center font-bold">
                  O
                </div>
                <div>
                  <p className="font-bold text-[#12122B]">{post.author}</p>
                  <p className="text-sm text-[#6B6B85]">Assessoria &amp; Contabilidade</p>
                </div>
              </div>
            </div>

            {/* CTA banner */}
            <div className="bg-orcoma-gradient rounded-3xl px-6 sm:px-10 py-12 mt-8 text-center text-white shadow-[0_20px_60px_rgba(9,36,167,0.25)]">
              <h2 className="text-2xl sm:text-3xl font-extrabold">Precisa de ajuda com esse assunto?</h2>
              <p className="mt-3 text-white/85 max-w-xl mx-auto">
                Nossa equipe de especialistas está pronta para orientar você e o seu negócio.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                <a
                  href="https://wa.me/5575999882400?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20um%20consultor!"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black text-sm font-extrabold px-6 py-3 rounded-full transition-colors duration-200"
                >
                  <i className="fa-solid fa-comments"></i>
                  Falar com Consultor
                </a>
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center gap-2 border-2 border-white/70 text-white text-sm font-extrabold px-6 py-3 rounded-full transition-colors duration-200 hover:bg-white/10"
                >
                  <i className="fa-solid fa-newspaper"></i>
                  Ver outros artigos
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};