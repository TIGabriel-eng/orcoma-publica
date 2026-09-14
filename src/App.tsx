/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Diferenciais } from './components/Diferenciais';
import { SobreNos } from './components/SobreNos';
import { ContabilidadePublica } from './components/ContabilidadePublica';
import { MeiosContato } from './components/MeiosContato';
import { Blog } from './components/Blog';
import { BlogPage } from './components/BlogPage';
import { BlogPostPage } from './components/BlogPostPage';
import { Clientes } from './components/Clientes';
import { Contato } from './components/Contato';
import { Footer } from './components/Footer';
import { WhatsAppFloating } from './components/WhatsAppFloating';
import { AreaClienteModal } from './components/AreaClienteModal';
import { CookieConsent } from './components/CookieConsent';

type Page = { name: 'home' } | { name: 'blog' } | { name: 'post'; slug: string };

export default function App() {
  const [isAreaClienteOpen, setIsAreaClienteOpen] = useState(false);
  const [page, setPage] = useState<Page>({ name: 'home' });

  const handleOpenContact = () => {
    const el = document.getElementById('contato');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const openBlog = () => {
    setPage({ name: 'blog' });
    window.scrollTo({ top: 0 });
  };

  const openHome = () => {
    setPage({ name: 'home' });
    window.scrollTo({ top: 0 });
  };

  const openPost = (slug: string) => {
    setPage({ name: 'post', slug });
    window.scrollTo({ top: 0 });
  };

  const isBlogView = page.name !== 'home';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-yellow-400 selection:text-[#0c0ccc]">
      {/* Sticky Header with Area do Cliente trigger */}
      <Header
        onOpenContactModal={handleOpenContact}
        onOpenAreaCliente={() => setIsAreaClienteOpen(true)}
        onOpenBlog={openBlog}
        onOpenHome={openHome}
      />

      {isBlogView ? (
        <main className="flex-grow">
          {page.name === 'post' ? (
            <BlogPostPage slug={page.slug} onBack={() => setPage({ name: 'blog' })} />
          ) : (
            <BlogPage onBack={openHome} onOpenPost={openPost} />
          )}
        </main>
      ) : (
        <>
          {/* Main Content Sections */}
          <main className="flex-grow">
            {/* Hero Section */}
            <Hero />

            {/* Diferenciais Section (3 Cards) */}
            <Diferenciais />

            {/* Sobre Nós Section */}
            <SobreNos />

            {/* Contabilidade Pública Ágil & Transparente */}
            <ContabilidadePublica />

            {/* Meios de Contato (4 Cards & Informações) */}
            <MeiosContato />

            {/* Blog Orcoma */}
            <Blog onOpenBlog={openBlog} onOpenPost={openPost} />

            {/* Clientes Orcoma (Depoimentos Google) */}
            <Clientes />

            {/* Contato & Proposta Section */}
            <Contato />
          </main>
        </>
      )}

      {/* Rodapé Corporativo */}
      <Footer />

      {/* Botão Flutuante de WhatsApp */}
      <WhatsAppFloating />

      {/* Modal de Área do Cliente */}
      <AreaClienteModal
        isOpen={isAreaClienteOpen}
        onClose={() => setIsAreaClienteOpen(false)}
        onContactSupport={handleOpenContact}
      />

      {/* Banner de Consentimento de Cookies */}
      <CookieConsent />
    </div>
  );
}

