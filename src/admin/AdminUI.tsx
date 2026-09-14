import type { ReactNode } from 'react';
import { X } from 'lucide-react';

/** Paleta de cores do painel (mesma identidade visual do mockup). */
export const TOKENS = {
  navy: '#171339',
  navyLight: '#241F5C',
  gold: '#D9A441',
  goldSoft: '#F2E4C4',
  teal: '#1C9C82',
  bg: '#F5F5F7',
  card: '#FFFFFF',
  text: '#1C1B2E',
  muted: '#6B6885',
  border: '#E7E6EF',
};

/** Pílula de status (Publicado / Rascunho / Ativo / Pendente / Inativo). */
export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    Publicado: { bg: '#E4F5F0', fg: TOKENS.teal },
    Rascunho: { bg: '#F2E4C4', fg: '#8A6A1E' },
    Ativo: { bg: '#E4F5F0', fg: TOKENS.teal },
    Pendente: { bg: '#F2E4C4', fg: '#8A6A1E' },
    Inativo: { bg: '#F1EFF6', fg: TOKENS.muted },
    admin: { bg: '#EAF2FF', fg: '#0924A7' },
    superadmin: { bg: '#F2E4C4', fg: '#8A6A1E' },
  };
  const c = map[status] ?? map.Rascunho;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {status}
    </span>
  );
}

/** Cabeçalho de seção com título, subtítulo e ação opcional. */
export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-6">
      <div>
        <h1 className="text-2xl" style={{ fontFamily: 'Georgia, serif', color: TOKENS.text }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: TOKENS.muted }}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/** Tabela de dados reutilizável do painel. */
export function DataTable({
  columns,
  rows,
  renderRow,
}: {
  columns: readonly string[];
  rows: readonly unknown[];
  renderRow: (row: unknown) => ReactNode;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ backgroundColor: TOKENS.card, border: `1px solid ${TOKENS.border}` }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: `1px solid ${TOKENS.border}` }}>
            {columns.map((c) => (
              <th
                key={c}
                className="text-left px-5 py-3 font-medium"
                style={{ color: TOKENS.muted }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: i < rows.length - 1 ? `1px solid ${TOKENS.border}` : 'none',
              }}
            >
              {renderRow(row)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------- Formulários de edição ----------------------- */

/** Classe compartilhada para inputs/selects/textareas do painel. */
export const inputClass =
  'w-full rounded-lg border border-[#E7E6EF] bg-white px-3.5 py-2.5 text-sm text-[#1C1B2E] outline-none transition focus:border-[#D9A441] focus:ring-2 focus:ring-[#D9A441]/30 placeholder:text-[#6B6885]/60';

/** Rótulo + campo de formulário (evita repetir markup em cada modal). */
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium mb-1.5" style={{ color: TOKENS.text }}>
        {label}
      </span>
      {children}
      {hint && (
        <span className="block text-xs mt-1.5" style={{ color: TOKENS.muted }}>
          {hint}
        </span>
      )}
    </label>
  );
}

/** Modal reutilizável do painel com fundo escurecido. */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className={`w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} rounded-2xl bg-white shadow-2xl mt-4 sm:mt-10`}
        style={{ border: `1px solid ${TOKENS.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${TOKENS.border}` }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ fontFamily: 'Georgia, serif', color: TOKENS.text }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 transition hover:bg-black/5"
            aria-label="Fechar"
          >
            <X size={18} style={{ color: TOKENS.muted }} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}