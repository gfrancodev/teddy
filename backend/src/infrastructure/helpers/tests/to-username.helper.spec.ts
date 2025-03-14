import { describe, it, expect } from 'vitest';
import { toUsername } from '../to-username.helper';

describe('toUsername Helper', () => {
  it('deve converter string para formato de username válido', () => {
    expect(toUsername('João Silva')).toBe('joaosilva');
    expect(toUsername('Maria.Souza')).toBe('maria.souza');
    expect(toUsername('carlos_123')).toBe('carlos_123');
  });

  it('deve remover acentos e caracteres especiais', () => {
    expect(toUsername('José Câmara')).toBe('josecamara');
    expect(toUsername('André González')).toBe('andregonzalez');
    expect(toUsername('João & Maria')).toBe('joaomaria');
  });

  it('deve lidar com múltiplos espaços', () => {
    expect(toUsername('João  da   Silva')).toBe('joaodasilva');
  });

  it('deve manter pontos e underscores', () => {
    expect(toUsername('user.name_123')).toBe('user.name_123');
  });

  it('deve converter para minúsculas', () => {
    expect(toUsername('USER.NAME')).toBe('user.name');
  });

  it('deve remover caracteres não permitidos', () => {
    expect(toUsername('user@name#123')).toBe('username123');
  });
});
