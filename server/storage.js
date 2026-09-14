/**
 * storage.js — acesso ao Supabase Storage (bucket próprio "orcoma-publica").
 * Centraliza upload, URL pública e remoção de imagens.
 */
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_STORAGE_BUCKET } from './config.js';

function client() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    const err = new Error('Armazenamento Supabase não configurado.');
    err.status = 500;
    throw err;
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

/** Sobe um arquivo para o bucket e devolve a URL pública. */
export async function uploadBuffer(buffer, { contentType, fileName }) {
  const supabase = client();
  const { error } = await supabase.storage.from(SUPABASE_STORAGE_BUCKET).upload(fileName, buffer, {
    contentType,
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw error;
  return getPublicUrl(fileName);
}

/** Monta a URL pública de um objeto do bucket. */
export function getPublicUrl(name) {
  const supabase = client();
  return supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(name).data.publicUrl;
}

/**
 * Remove uma imagem do bucket. Aceita tanto a URL pública completa quanto o
 * caminho legado "/uploads/<arquivo>" (dado antigo). Nunca toca em arquivos
 * de outros buckets/projetos.
 */
export async function removeImage(value) {
  if (typeof value !== 'string' || !value) return;

  let pathname = null;
  if (value.startsWith('http')) {
    try {
      pathname = new URL(value).pathname;
    } catch {
      return;
    }
    const prefix = `/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`;
    if (!pathname.startsWith(prefix)) return; // não é do nosso bucket
    pathname = pathname.slice(prefix.length);
  } else if (value.startsWith('/uploads/')) {
    pathname = value.slice('/uploads/'.length);
  } else {
    return;
  }

  if (!pathname) return;
  const supabase = client();
  await supabase.storage.from(SUPABASE_STORAGE_BUCKET).remove([pathname]);
}