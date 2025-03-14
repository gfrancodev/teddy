import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generateHash, compareHash } from '../hash.helper';
import * as argon2 from 'argon2';

vi.mock('argon2', () => ({
  hash: vi.fn(),
  verify: vi.fn(),
  argon2id: 'argon2id',
}));

describe('Hash Helper', () => {
  const MOCK_PEPPER = 'IX2aaQqd97PD'; // Usando o mesmo valor do .env

  beforeAll(() => {
    process.env.PASSWORD_HASH_PEPPER = MOCK_PEPPER;
  });

  describe('generateHash', () => {
    it('deve gerar um hash com pepper', async () => {
      const mockHash = 'hashed_password';
      vi.mocked(argon2.hash).mockResolvedValue(mockHash);

      const password = 'password123';
      const result = await generateHash(password);

      expect(result).toBe(mockHash);
      expect(argon2.hash).toHaveBeenCalledWith(
        `${password}${MOCK_PEPPER}`,
        expect.any(Object),
      );
    });

    it('deve lançar erro se a geração do hash falhar', async () => {
      vi.mocked(argon2.hash).mockRejectedValue(new Error('Hash error'));

      await expect(generateHash('password123')).rejects.toThrow(
        'Error generating password hash',
      );
    });
  });

  describe('compareHash', () => {
    it('deve comparar senha e hash corretamente', async () => {
      vi.mocked(argon2.verify).mockResolvedValue(true);

      const password = 'password123';
      const hash = 'hashed_password';
      const result = await compareHash(password, hash);

      expect(result).toBe(true);
      expect(argon2.verify).toHaveBeenCalledWith(
        hash,
        `${password}${MOCK_PEPPER}`,
      );
    });

    it('deve retornar false para senha incorreta', async () => {
      vi.mocked(argon2.verify).mockResolvedValue(false);

      const result = await compareHash('wrong_password', 'hash');
      expect(result).toBe(false);
    });

    it('deve lançar erro se a comparação falhar', async () => {
      vi.mocked(argon2.verify).mockRejectedValue(new Error('Verify error'));

      await expect(compareHash('password123', 'hash')).rejects.toThrow(
        'Error comparing password',
      );
    });
  });
});
