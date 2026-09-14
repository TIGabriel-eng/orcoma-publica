/**
 * seed.js — cria/atualiza usuários do painel com senha em hash bcrypt.
 * Os dados vão para o Postgres (Supabase, schema publica).
 *
 * Uso:
 *   npm run seed -- <email> <senha> [nome] [role]
 *   npm run seed -- admin@orcoma.com.br "NovaSenha@123" "Equipe Admin" admin
 */
import bcrypt from 'bcryptjs';
import { pool, findUserByEmail } from '../db.js';

const args = process.argv.slice(2);
const email = (args[0] || '').trim();
const password = args[1] || '';
const name = args.length >= 3 ? args[2] : 'Novo Usuário';
const role = args[3] || 'admin';

if (!email || !password) {
  console.error('Uso: node server/scripts/seed.js <email> <senha> [nome] [role]');
  process.exit(1);
}

// bcrypt.hashSync garante que a senha NUNCA é gravada em texto pleno
const passwordHash = bcrypt.hashSync(password, 10);

try {
  const existing = await findUserByEmail(email);

  if (existing) {
    const nextName = args.length >= 3 ? name : existing.name;
    await pool.query(
      'UPDATE publica.users SET password_hash = $1, name = $2, role = $3 WHERE id = $4',
      [passwordHash, nextName, role, existing.id],
    );
    console.log(`Senha atualizada para ${email} (${nextName}).`);
  } else {
    await pool.query(
      'INSERT INTO publica.users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
      [name, email, passwordHash, role],
    );
    console.log(`Usuário criado: ${email} (${name}).`);
  }
} catch (error) {
  console.error('Erro ao executar seed:', error);
  process.exitCode = 1;
} finally {
  await pool.end();
}