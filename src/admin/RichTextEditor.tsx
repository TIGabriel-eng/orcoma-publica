import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Heading2,
  Heading3,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react';
import { TOKENS } from './AdminUI';

/** Converte os blocos salvos (string[]) em HTML para o editor. */
export function blocksToHtml(blocks: string[] | string): string {
  const list = Array.isArray(blocks) ? blocks : [blocks];
  return list
    .map((block) => {
      const b = String(block ?? '').trim();
      if (!b) return '';
      return /^<\/?[a-z][a-z0-9]*(\s|>)/i.test(b) ? b : `<p>${b}</p>`;
    })
    .join('');
}

/** Converte o HTML do editor em blocos (string[]) para salvar no banco. */
export function htmlToBlocks(html: string): string[] {
  const cleaned = String(html ?? '').trim();
  if (!cleaned) return [];

  const doc = new DOMParser().parseFromString(cleaned, 'text/html');
  const blocks: string[] = [];

  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      if (tag === 'div') {
        // Aplaina divs internas: preserva o conteúdo de cada bloco raiz.
        blocks.push(el.outerHTML);
      } else {
        blocks.push(el.outerHTML);
      }
    } else if (node.textContent?.trim()) {
      blocks.push(`<p>${node.textContent.trim()}</p>`);
    }
  });

  return blocks.filter((b) => b && b.replace(/<[^>]*>/g, '').trim());
}

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class: 'rich-content min-h-[300px] focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="rich-editor rounded-xl p-4" style={{ border: `1px solid ${TOKENS.border}` }} />;
  }

  const buttonBase = (active = false) => ({
    padding: '0.4rem 0.55rem',
    borderRadius: 8,
    color: active ? '#FFFFFF' : TOKENS.muted,
    backgroundColor: active ? TOKENS.navy : 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.15s, color 0.15s',
  });

  const ToolbarBtn = ({
    onClick,
    active,
    label,
    children,
  }: {
    onClick: () => void;
    active: boolean;
    label: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      style={buttonBase(active)}
      className="hover:bg-black/5"
    >
      {children}
    </button>
  );

  const run = (fn: () => void) => () => {
    fn();
    editor.commands.focus();
  };

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL do link:', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="rich-editor">
      {/* Barra de ferramentas */}
      <div
        className="flex flex-wrap items-center gap-1 px-2 py-1.5 sticky top-0 z-10"
        style={{ backgroundColor: '#F8F8FB', border: `1px solid ${TOKENS.border}`, borderBottom: 'none', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
      >
        <ToolbarBtn onClick={run(() => editor.chain().focus().toggleBold().run())} active={editor.isActive('bold')} label="Negrito">
          <Bold size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={run(() => editor.chain().focus().toggleItalic().run())} active={editor.isActive('italic')} label="Itálico">
          <Italic size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={run(() => editor.chain().focus().toggleUnderline().run())} active={editor.isActive('underline')} label="Sublinhado">
          <Underline size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={run(() => editor.chain().focus().toggleStrike().run())} active={editor.isActive('strike')} label="Tachado">
          <Strikethrough size={16} />
        </ToolbarBtn>

        <span style={{ width: 1, height: 22, backgroundColor: TOKENS.border, margin: '0 6px' }} />

        <ToolbarBtn
          onClick={run(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}
          active={editor.isActive('heading', { level: 2 })}
          label="Título (tópico)"
        >
          <Heading2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={run(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}
          active={editor.isActive('heading', { level: 3 })}
          label="Subtítulo"
        >
          <Heading3 size={16} />
        </ToolbarBtn>

        <span style={{ width: 1, height: 22, backgroundColor: TOKENS.border, margin: '0 6px' }} />

        <ToolbarBtn onClick={run(() => editor.chain().focus().toggleBulletList().run())} active={editor.isActive('bulletList')} label="Lista com marcadores">
          <List size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={run(() => editor.chain().focus().toggleOrderedList().run())} active={editor.isActive('orderedList')} label="Lista numerada">
          <ListOrdered size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={run(() => editor.chain().focus().toggleBlockquote().run())} active={editor.isActive('blockquote')} label="Citação">
          <Quote size={16} />
        </ToolbarBtn>

        <span style={{ width: 1, height: 22, backgroundColor: TOKENS.border, margin: '0 6px' }} />

        <ToolbarBtn
          onClick={run(() => editor.chain().focus().setTextAlign('left').run())}
          active={editor.isActive({ textAlign: 'left' })}
          label="Alinhar à esquerda"
        >
          <AlignLeft size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={run(() => editor.chain().focus().setTextAlign('center').run())}
          active={editor.isActive({ textAlign: 'center' })}
          label="Centralizar"
        >
          <AlignCenter size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={run(() => editor.chain().focus().setTextAlign('right').run())}
          active={editor.isActive({ textAlign: 'right' })}
          label="Alinhar à direita"
        >
          <AlignRight size={16} />
        </ToolbarBtn>

        <span style={{ width: 1, height: 22, backgroundColor: TOKENS.border, margin: '0 6px' }} />

        <ToolbarBtn onClick={run(setLink)} active={editor.isActive('link')} label="Inserir link">
          <Link size={16} />
        </ToolbarBtn>

        <span style={{ width: 1, height: 22, backgroundColor: TOKENS.border, margin: '0 6px' }} />

        <ToolbarBtn
          onClick={run(() => editor.chain().focus().undo().run())}
          active={false}
          label="Desfazer"
        >
          <Undo2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={run(() => editor.chain().focus().redo().run())}
          active={false}
          label="Refazer"
        >
          <Redo2 size={16} />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={run(() => editor.chain().focus().clearNodes().unsetAllMarks().run())}
          active={false}
          label="Limpar formatação"
        >
          <Eraser size={16} />
        </ToolbarBtn>
      </div>

      {/* Área de edição */}
      <div
        className="rich-editor-body"
        style={{ border: `1px solid ${TOKENS.border}`, borderTop: 'none', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, backgroundColor: '#FFFFFF' }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}