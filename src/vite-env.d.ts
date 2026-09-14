/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL opcional da API (em branco = mesmo domínio, via proxy do Vite). */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}