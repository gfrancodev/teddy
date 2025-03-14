import { Pool } from 'pg';
import { generateHash } from '../src/infrastructure/helpers/hash.helper';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';

config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  user: process.env.POSTGRES_USER || 'user',
  password: process.env.POSTGRES_PASSWORD || 'password',
  database: process.env.POSTGRES_DB || 'teddy',
});

async function loadSchema() {
  const client = await pool.connect();
  try {
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSQL = readFileSync(schemaPath, 'utf8');

    await client.query(schemaSQL);
    console.log('\n=== Schema Carregado ===\n');
  } catch (error) {
    console.error('❌ Erro ao carregar schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function seedData() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const adminPassword = await generateHash('Admin@123');
    await client.query(
      `
      INSERT INTO "user" (
        fullname,
        email,
        username,
        password,
        status,
        role,
        verified
      ) VALUES (
        'Administrador',
        'admin@teddy.com',
        'admin',
        $1,
        'active',
        'admin',
        true
      ) ON CONFLICT (email) DO NOTHING
    `,
      [adminPassword],
    );

    const userPassword = await generateHash('User@123');
    await client.query(
      `
      INSERT INTO "user" (
        fullname,
        email,
        username,
        password,
        status,
        role,
        verified
      ) VALUES (
        'Usuário Teste',
        'user@teddy.com',
        'user',
        $1,
        'active',
        'user',
        true
      ) ON CONFLICT (email) DO NOTHING
    `,
      [userPassword],
    );

    const { rows: [testUser] } = await client.query(
      'SELECT id FROM "user" WHERE email = $1',
      ['user@teddy.com'],
    );

    await client.query(
      'DELETE FROM client WHERE user_id = $1',
      [testUser.id],
    );

    const clientesExemplo = [
      {
        name: 'Empresa ABC',
        salary: 5000.0,
        company_value: 1000000.0,
      },
      {
        name: 'Startup XYZ',
        salary: 8000.0,
        company_value: 2000000.0,
      },
      {
        name: 'Consultoria 123',
        salary: 12000.0,
        company_value: 3000000.0,
      },
    ];

    for (const cliente of clientesExemplo) {
      await client.query(
        `
        INSERT INTO "client" (
          user_id,
          name,
          salary,
          company_value,
          status
        ) VALUES (
          $1,
          $2,
          $3,
          $4,
          'active'
        )
      `,
        [testUser.id, cliente.name, cliente.salary, cliente.company_value],
      );
    }

    await client.query('COMMIT');

    const { rows: users } = await client.query(
      'SELECT fullname, email, username, role FROM "user"',
    );
    const { rows: clients } = await client.query(
      'SELECT name, salary, company_value FROM client',
    );

    console.log('\n=== Dados Criados ===\n');

    console.log('Usuários:');
    console.table(
      users.map((user) => ({
        Nome: user.fullname,
        Email: user.email,
        Username: user.username,
        Perfil: user.role,
        Senha: user.role === 'admin' ? 'Admin@123' : 'User@123',
      })),
    );

    console.log('\nClientes:');
    console.table(
      clients.map((client) => ({
        Nome: client.name,
        Salário: `R$ ${client.salary.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        'Valor da Empresa': `R$ ${client.company_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      })),
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Erro ao inserir dados:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function seed() {
  try {
    await loadSchema();
    await seedData();
    console.log('\n✅ Seed concluído com sucesso!\n');
  } catch (error) {
    console.error('\n❌ Erro durante o processo:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

seed(); 