/**
 * api/index.js — entrypoint da Vercel.
 * Envolve a aplicação Express em uma função serverless (serverless-http).
 * Todas as rotas /api/* e uploads são entregues por aqui.
 */
import serverless from 'serverless-http';
import app from '../server/app.js';

export default serverless(app);