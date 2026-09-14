import { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, Loader2, Newspaper, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { authedFetch } from '../auth/api';
import { DataTable, Field, inputClass, Modal, SectionHeader, StatusPill, TOKENS } from './AdminUI';
import { RichTextEditor, blocksToHtml, htmlToBlocks } from './RichTextEditor';

/* ------------------------------ dados ------------------------------ */

interface Stat {
  label: string;
  value: string;
  delta: string;
}

const STATIC_STATS = [
  { label: 'Posts publicados', value: '—', delta: 'conectando à API…' },
  { label: 'Usuários cadastrados', value: '—', delta: 'conectando à API…' },
  { label: 'Rascunhos', value: '—', delta: 'conectando à API…' },
];

const ACTIVITY = [
  { who: 'Marina Alves', what: 'publicou o post “Novas regras da LGPD para o setor público”', when: 'há 2h' },
  { who: 'Sistema', what: 'recebeu um novo formulário de contato de Ricardo Nunes', when: 'há 5h' },
  { who: 'João Pedro', what: 'editou o post “Prestação de contas: guia rápido”', when: 'ontem' },
  { who: 'Sistema', what: 'novo usuário cadastrado: Camila Ferreira', when: 'ontem' },
];

interface FormSubmission {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  formaContato: string;
  origem?: string;
  createdAt: string;
}

interface Post {
  id: string;
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string[] | string;
  date: string;
  dateIso: string;
  readTime: string;
  author: string;
  status: string;
  image?: string | null;
}

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

/* --------------------------- utilitários --------------------------- */

function formatCreatedAt(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatDateTime(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error ?? 'Não foi possível completar a ação.';
  } catch {
    return 'Não foi possível completar a ação.';
  }
}

/* ------------------------------ Início ------------------------------ */

export function InicioView() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stat[]>(STATIC_STATS);

  useEffect(() => {
    let active = true;
    if (!token) return;

    authedFetch('/stats', token)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.stats) setStats(data.stats);
      })
      .catch(() => {
        /* API indisponível: mantém dados estáticos */
      });

    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div>
      <SectionHeader
        title="Olá, Equipe Orcoma"
        subtitle="Aqui está um resumo do que está acontecendo no site hoje."
      />
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-5"
            style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
          >
            <p className="text-sm" style={{ color: TOKENS.muted }}>
              {s.label}
            </p>
            <p className="text-3xl mt-2" style={{ fontFamily: 'Georgia, serif', color: TOKENS.text }}>
              {s.value}
            </p>
            <p className="text-xs mt-2" style={{ color: TOKENS.teal }}>
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      <p className="text-sm font-medium mb-3" style={{ color: TOKENS.text }}>
        Atividade recente
      </p>
      <div
        className="rounded-xl"
        style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
      >
        {ACTIVITY.map((a, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-5 py-4"
            style={{
              borderBottom: i < ACTIVITY.length - 1 ? `1px solid ${TOKENS.border}` : 'none',
            }}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: TOKENS.gold }}
            />
            <p className="text-sm" style={{ color: TOKENS.text }}>
              <span className="font-medium">{a.who}</span> {a.what}
            </p>
            <span className="ml-auto text-xs flex-shrink-0" style={{ color: TOKENS.muted }}>
              {a.when}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- Editor de post --------------------------- */

function PostEditor({
  initial,
  onCancel,
  onSave,
  onUpload,
}: {
  initial: Post | null;
  onCancel: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? '');
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? '');
  const [author, setAuthor] = useState(initial?.author ?? 'Equipe Orcoma');
  const [status, setStatus] = useState(initial?.status ?? 'Rascunho');
  const [content, setContent] = useState(initial ? blocksToHtml(initial.content) : '');
  const [image, setImage] = useState<string | null>(initial?.image ?? null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Libera a prévia local quando o editor é fechado/desmontado.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  const removeImage = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImage(null);
  };

  // Mostra a prévia assim que o arquivo é escolhido e sobe para o servidor
  // em seguida, trocando a prévia local pela URL final.
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    objectUrlRef.current = previewUrl;
    setImage(previewUrl);
    setImageUrl('');
    setUploading(true);
    setLocalError('');
    try {
      const url = await onUpload(file);
      setImage(url);
    } catch (err) {
      setImage(null);
      setLocalError(err instanceof Error ? err.message : 'Falha ao enviar a imagem.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    const paragraphs = htmlToBlocks(content);
    if (!title.trim() || paragraphs.length === 0) {
      setLocalError('Informe pelo menos o título e o conteúdo.');
      return;
    }
    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        category: category.trim() || 'Geral',
        subtitle: subtitle.trim(),
        excerpt: excerpt.trim(),
        author: author.trim() || 'Equipe Orcoma',
        status,
        content: paragraphs,
        image: image ?? null,
      });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erro ao salvar o post.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Imagem de capa">
        {image ? (
          <div
            className="rounded-xl overflow-hidden mb-3"
            style={{ border: `1px solid ${TOKENS.border}` }}
          >
            <img src={image} alt="Capa do post" className="w-full h-44 object-cover" />
          </div>
        ) : (
          <div
            className="flex items-center justify-center rounded-xl mb-3"
            style={{
              backgroundColor: '#F1EFF6',
              border: `1px dashed ${TOKENS.border}`,
            }}
          >
            <Newspaper size={28} style={{ color: TOKENS.muted, margin: '2.5rem 0' }} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: TOKENS.navy }}
            disabled={uploading}
          >
            {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            {uploading ? 'Enviando…' : 'Enviar imagem'}
          </button>
          {image && (
            <button
              type="button"
              onClick={removeImage}
              className="rounded-lg px-3.5 py-2 text-sm font-medium transition hover:bg-red-50"
              style={{ color: '#B3261E' }}
              disabled={uploading}
            >
              Remover
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <input
            className={inputClass}
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="…ou cole o link de uma imagem"
            disabled={uploading}
          />
          <button
            type="button"
            onClick={() => {
              const url = imageUrl.trim();
              if (!url) {
                setLocalError('Informe um link de imagem válido.');
                return;
              }
              if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
              }
              setImage(url);
              setImageUrl('');
            }}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-white whitespace-nowrap transition hover:opacity-90"
            style={{ backgroundColor: TOKENS.teal }}
            disabled={uploading}
          >
            Usar link
          </button>
        </div>
      </Field>

      <Field label="Título do post">
        <input
          className={inputClass}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Como declarar o IRPJ corretamente"
          disabled={saving}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Categoria">
          <input
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex.: Fiscal"
            disabled={saving}
          />
        </Field>
        <Field label="Status">
          <select
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={saving}
          >
            <option value="Rascunho">Rascunho</option>
            <option value="Publicado">Publicado</option>
          </select>
        </Field>
      </div>

      <Field label="Subtítulo">
        <input
          className={inputClass}
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="Frase de apoio logo abaixo do título"
          disabled={saving}
        />
      </Field>

      <Field label="Resumo (aparece nos cards do blog)">
        <textarea
          className={`${inputClass} resize-none`}
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Chamada curta exibida na listagem do blog"
          disabled={saving}
        />
      </Field>

      <Field label="Autor">
        <input
          className={inputClass}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Equipe Orcoma"
          disabled={saving}
        />
      </Field>

      <Field label="Conteúdo do post">
        <div className="mt-1">
          <RichTextEditor value={content} onChange={setContent} />
        </div>
      </Field>

      {localError && (
        <p className="text-sm mb-4" style={{ color: '#B3261E' }}>
          {localError}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-black/5"
          style={{ color: TOKENS.muted }}
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ backgroundColor: TOKENS.navy }}
          disabled={saving}
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {initial ? 'Salvar alterações' : 'Publicar post'}
        </button>
      </div>
    </form>
  );
}

/* ------------------------------ Blog ------------------------------ */

export function BlogView() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState<Post | null>(null);

  const loadPosts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await authedFetch('/posts', token);
      if (!res.ok) throw new Error(await readError(res));
      const data = (await res.json()) as { posts: Post[] };
      setPosts(data.posts ?? []);
      setLoadError('');
    } catch {
      setLoadError('Não foi possível carregar os posts. Verifique se o servidor está online.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditing(post);
    setEditorOpen(true);
  };

  const uploadImage = async (file: File) => {
    if (!token) throw new Error('Sessão inválida. Faça login novamente.');
    const formData = new FormData();
    formData.append('file', file);
    const res = await authedFetch('/uploads', token, { method: 'POST', body: formData });
    if (!res.ok) throw new Error(await readError(res));
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  const handleSave = async (data: Record<string, unknown>) => {
    if (!token) return;
    const res = await authedFetch(editing ? `/posts/${editing.id}` : '/posts', token, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await readError(res));
    setEditorOpen(false);
    await loadPosts();
  };

  const confirmDelete = async () => {
    if (!token || !deleting) return;
    try {
      const res = await authedFetch(`/posts/${deleting.id}`, token, { method: 'DELETE' });
      if (!res.ok) throw new Error(await readError(res));
      setDeleting(null);
      await loadPosts();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Falha ao excluir o post.');
      setDeleting(null);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Blog"
        subtitle={`${posts.length} posts no total`}
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: TOKENS.navy }}
          >
            <Plus size={16} />
            Novo post
          </button>
        }
      />

      {loading ? (
        <div
          className="flex items-center justify-center gap-3 rounded-xl py-16"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <Loader2 size={20} className="animate-spin" style={{ color: TOKENS.muted }} />
          <p className="text-sm" style={{ color: TOKENS.muted }}>
            Carregando posts…
          </p>
        </div>
      ) : loadError ? (
        <div
          className="rounded-xl p-6 text-center"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <p className="text-sm mb-4" style={{ color: '#B3261E' }}>
            {loadError}
          </p>
          <button
            onClick={loadPosts}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: TOKENS.navy }}
          >
            Tentar novamente
          </button>
        </div>
      ) : posts.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <Newspaper size={32} style={{ color: TOKENS.muted }} />
          <p className="text-sm mt-3" style={{ color: TOKENS.muted }}>
            Nenhum post ainda. Clique em “Novo post” para criar o primeiro.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="flex flex-col rounded-xl overflow-hidden transition hover:shadow-lg"
              style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
            >
              {/* Foto/capa do post */}
              <div className="relative h-36">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="h-36 w-full object-cover" />
                ) : (
                  <div
                    className="h-36 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${TOKENS.navy}, ${TOKENS.navyLight})`,
                    }}
                  >
                    <Newspaper size={36} color={TOKENS.gold} />
                  </div>
                )}
                <span
                  className="absolute top-3 left-3 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: TOKENS.gold, color: '#FFFFFF' }}
                >
                  {post.category}
                </span>
                <span className="absolute top-3 right-3">
                  <StatusPill status={post.status} />
                </span>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3
                  className="text-sm font-semibold leading-snug line-clamp-2"
                  style={{ color: TOKENS.text }}
                >
                  {post.title}
                </h3>
                <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: TOKENS.muted }}>
                  {post.excerpt}
                </p>
                <p className="text-xs mt-3" style={{ color: TOKENS.muted }}>
                  {post.date} · {post.readTime} de leitura
                </p>

                <div
                  className="flex items-center justify-between pt-3 mt-auto"
                  style={{ borderTop: `1px solid ${TOKENS.border}` }}
                >
                  <button
                    onClick={() => openEdit(post)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:bg-black/5"
                    style={{ color: TOKENS.navy }}
                  >
                    <Pencil size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => setDeleting(post)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition hover:bg-red-50"
                    style={{ color: '#B3261E' }}
                  >
                    <Trash2 size={14} />
                    Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {editorOpen && (
        <Modal
          open
          onClose={() => setEditorOpen(false)}
          title={editing ? 'Editar post' : 'Novo post'}
          wide
        >
          <PostEditor
            initial={editing}
            onCancel={() => setEditorOpen(false)}
            onSave={handleSave}
            onUpload={uploadImage}
          />
        </Modal>
      )}

      {deleting && (
        <Modal open onClose={() => setDeleting(null)} title="Excluir post">
          <p className="text-sm" style={{ color: TOKENS.text }}>
            Excluir o post <span className="font-medium">“{deleting.title}”</span>? Essa ação não
            pode ser desfeita.
          </p>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => setDeleting(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-black/5"
              style={{ color: TOKENS.muted }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: '#B3261E' }}
            >
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ------------------------- Editor de usuário ------------------------- */

function UserEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial: AdminUser | null;
  onCancel: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState(initial?.role ?? 'admin');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!name.trim() || !email.trim()) {
      setLocalError('Informe o nome e o e-mail.');
      return;
    }
    if (password && password.length < 6) {
      setLocalError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { name: name.trim(), email: email.trim(), role };
      if (password) payload.password = password;
      await onSave(payload);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Erro ao salvar o usuário.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Nome">
        <input
          className={inputClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome completo"
          disabled={saving}
        />
      </Field>

      <Field label="E-mail">
        <input
          className={inputClass}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@orcoma.com.br"
          disabled={saving}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Perfil">
          <select
            className={inputClass}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={saving}
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Super admin</option>
          </select>
        </Field>

        <Field
          label={initial ? 'Nova senha' : 'Senha'}
          hint={initial ? 'Deixe em branco para manter a atual.' : 'Mínimo de 6 caracteres.'}
        >
          <input
            className={inputClass}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={saving}
          />
        </Field>
      </div>

      {localError && (
        <p className="text-sm mb-4" style={{ color: '#B3261E' }}>
          {localError}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-black/5"
          style={{ color: TOKENS.muted }}
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ backgroundColor: TOKENS.navy }}
          disabled={saving}
        >
          {saving && <Loader2 size={15} className="animate-spin" />}
          {initial ? 'Salvar alterações' : 'Criar usuário'}
        </button>
      </div>
    </form>
  );
}

/* ---------------------------- Usuários ---------------------------- */

export function UsuariosView() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await authedFetch('/users', token);
      if (!res.ok) throw new Error(await readError(res));
      const data = (await res.json()) as { users: AdminUser[] };
      setUsers(data.users ?? []);
      setLoadError('');
    } catch {
      setLoadError('Não foi possível carregar os usuários. Verifique se o servidor está online.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openCreate = () => {
    setEditing(null);
    setEditorOpen(true);
  };

  const handleSave = async (data: Record<string, unknown>) => {
    if (!token) return;
    const res = await authedFetch(editing ? `/users/${editing.id}` : '/users', token, {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(await readError(res));
    setEditorOpen(false);
    await loadUsers();
  };

  const confirmDelete = async () => {
    if (!token || !deleting) return;
    try {
      const res = await authedFetch(`/users/${deleting.id}`, token, { method: 'DELETE' });
      if (!res.ok) throw new Error(await readError(res));
      setDeleting(null);
      await loadUsers();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Falha ao excluir o usuário.');
      setDeleting(null);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Usuários"
        subtitle={`${users.length} contas com acesso ao painel`}
        action={
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: TOKENS.navy }}
          >
            <Plus size={16} />
            Novo usuário
          </button>
        }
      />

      {loading ? (
        <div
          className="flex items-center justify-center gap-3 rounded-xl py-16"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <Loader2 size={20} className="animate-spin" style={{ color: TOKENS.muted }} />
          <p className="text-sm" style={{ color: TOKENS.muted }}>
            Carregando usuários…
          </p>
        </div>
      ) : loadError ? (
        <div
          className="rounded-xl p-6 text-center"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <p className="text-sm mb-4" style={{ color: '#B3261E' }}>
            {loadError}
          </p>
          <button
            onClick={loadUsers}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: TOKENS.navy }}
          >
            Tentar novamente
          </button>
        </div>
      ) : users.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <p className="text-sm" style={{ color: TOKENS.muted }}>
            Nenhum usuário cadastrado.
          </p>
        </div>
      ) : (
        <DataTable
          columns={['Nome', 'E-mail', 'Perfil', 'Criado em', '']}
          rows={users}
          renderRow={(u) => {
            const user = u as AdminUser;
            return (
              <>
                <td className="px-5 py-4 font-medium" style={{ color: TOKENS.text }}>
                  {user.name}
                </td>
                <td className="px-5 py-4" style={{ color: TOKENS.muted }}>
                  {user.email}
                </td>
                <td className="px-5 py-4">
                  <StatusPill status={user.role} />
                </td>
                <td className="px-5 py-4" style={{ color: TOKENS.muted }}>
                  {formatCreatedAt(user.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 justify-end">
                    <button
                      onClick={() => {
                        setEditing(user);
                        setEditorOpen(true);
                      }}
                      className="rounded-lg p-1.5 transition hover:bg-black/5"
                      aria-label="Editar usuário"
                    >
                      <Pencil size={16} style={{ color: TOKENS.muted }} />
                    </button>
                    <button
                      onClick={() => setDeleting(user)}
                      className="rounded-lg p-1.5 transition hover:bg-red-50"
                      aria-label="Excluir usuário"
                    >
                      <Trash2 size={16} style={{ color: TOKENS.muted }} />
                    </button>
                  </div>
                </td>
              </>
            );
          }}
        />
      )}

      {editorOpen && (
        <Modal
          open
          onClose={() => setEditorOpen(false)}
          title={editing ? 'Editar usuário' : 'Novo usuário'}
        >
          <UserEditor
            initial={editing}
            onCancel={() => setEditorOpen(false)}
            onSave={handleSave}
          />
        </Modal>
      )}

      {deleting && (
        <Modal open onClose={() => setDeleting(null)} title="Excluir usuário">
          <p className="text-sm" style={{ color: TOKENS.text }}>
            Excluir o usuário <span className="font-medium">“{deleting.name}”</span> (
            {deleting.email})? Essa ação não pode ser desfeita.
          </p>
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              onClick={() => setDeleting(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-black/5"
              style={{ color: TOKENS.muted }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmDelete}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: '#B3261E' }}
            >
              Excluir
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* --------------------------- Formulários --------------------------- */

export function FormulariosView() {
  const { token } = useAuth();
  const [forms, setForms] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [viewing, setViewing] = useState<FormSubmission | null>(null);

  const loadForms = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await authedFetch('/forms', token);
      if (!res.ok) throw new Error(await readError(res));
      const data = (await res.json()) as { forms: FormSubmission[] };
      setForms(data.forms ?? []);
      setLoadError('');
    } catch {
      setLoadError(
        'Não foi possível carregar os formulários. Verifique se o servidor está online.'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadForms();
  }, [loadForms]);

  const confirmDelete = async () => {
    if (!token || !viewing) return;
    try {
      const res = await authedFetch(`/forms/${viewing.id}`, token, { method: 'DELETE' });
      if (!res.ok) throw new Error(await readError(res));
      setViewing(null);
      await loadForms();
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Falha ao excluir o formulário.');
      setViewing(null);
    }
  };

  return (
    <div>
      <SectionHeader
        title="Formulários"
        subtitle={`${forms.length} envios recebidos pelo site`}
      />

      {loading ? (
        <div
          className="flex items-center justify-center gap-3 rounded-xl py-16"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <Loader2 size={20} className="animate-spin" style={{ color: TOKENS.muted }} />
          <p className="text-sm" style={{ color: TOKENS.muted }}>
            Carregando formulários…
          </p>
        </div>
      ) : loadError ? (
        <div
          className="rounded-xl p-6 text-center"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <p className="text-sm mb-4" style={{ color: '#B3261E' }}>
            {loadError}
          </p>
          <button
            onClick={loadForms}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: TOKENS.navy }}
          >
            Tentar novamente
          </button>
        </div>
      ) : forms.length === 0 ? (
        <div
          className="rounded-xl p-12 text-center"
          style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
        >
          <p className="text-sm mt-3" style={{ color: TOKENS.muted }}>
            Nenhum formulário recebido ainda.
          </p>
        </div>
      ) : (
        <DataTable
          columns={['Nome', 'E-mail', 'Telefone', 'Forma de contato', 'Recebido em', '']}
          rows={forms}
          renderRow={(f) => {
            const form = f as FormSubmission;
            return (
              <>
                <td className="px-5 py-4 font-medium" style={{ color: TOKENS.text }}>
                  {form.nome}
                </td>
                <td className="px-5 py-4" style={{ color: TOKENS.muted }}>
                  {form.email}
                </td>
                <td className="px-5 py-4" style={{ color: TOKENS.muted }}>
                  {form.telefone}
                </td>
                <td className="px-5 py-4">
                  <StatusPill status={form.formaContato} />
                </td>
                <td className="px-5 py-4" style={{ color: TOKENS.muted }}>
                  {formatDateTime(form.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setViewing(form)}
                      className="rounded-lg p-1.5 transition hover:bg-black/5"
                      aria-label="Ver formulário"
                    >
                      <Eye size={16} style={{ color: TOKENS.muted }} />
                    </button>
                  </div>
                </td>
              </>
            );
          }}
        />
      )}

      {viewing && (
        <Modal open onClose={() => setViewing(null)} title="Formulário recebido">
          <div
            className="rounded-xl overflow-hidden mb-5"
            style={{ border: `1px solid ${TOKENS.border}` }}
          >
            {[
              { label: 'Nome', value: viewing.nome },
              { label: 'Telefone', value: viewing.telefone },
              { label: 'E-mail', value: viewing.email },
              { label: 'Forma de contato preferida', value: viewing.formaContato },
              { label: 'Origem', value: viewing.origem ?? '—' },
              { label: 'Recebido em', value: formatDateTime(viewing.createdAt) },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                className="flex items-start gap-4 px-5 py-4"
                style={{
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${TOKENS.border}` : 'none',
                }}
              >
                <span className="w-40 text-xs font-medium flex-shrink-0 pt-0.5" style={{ color: TOKENS.muted }}>
                  {item.label}
                </span>
                <span className="text-sm" style={{ color: TOKENS.text }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={confirmDelete}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: '#B3261E' }}
            >
              <Trash2 size={15} />
              Excluir
            </button>
            <button
              onClick={() => setViewing(null)}
              className="rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-black/5"
              style={{ color: TOKENS.muted }}
            >
              Fechar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}