import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  // Lê o .env (DISABLE_HMR, PORT) — env de shell tem prioridade.
  const env = loadEnv(mode, process.cwd(), '');
  const disableHmr = env.DISABLE_HMR === 'true';
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      // Falha alto em vez de subir silenciosamente em outra porta (ex.: 3001).
      // Dois servidores Vite com tokens HMR diferentes causam o erro de
      // "WebSocket 400 — Failed during handshake" no navegador.
      strictPort: true,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      // Com --host=0.0.0.0 a página é servida via localhost, então fixamos o
      // host do HMR em localhost (evita o Vite escolher o IP da rede e errar).
      hmr: disableHmr
        ? false
        : {
            host: 'localhost',
          },
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: disableHmr ? null : {},
      // Proxy das chamadas /api para o servidor Express (npm run server).
      // As imagens agora são URLs públicas do Supabase (bucket orcoma-publica).
      proxy: {
        '/api': {
          target: `http://localhost:${env.PORT ?? process.env.PORT ?? 4000}`,
          changeOrigin: true,
        },
      },
    },
  };
});
