import { describe, it, expect, vi } from 'vitest';
import generateUUIDv7 from '../generate-uuidv7.helper';

describe('generateUUIDv7 Helper', () => {
  it('deve gerar um UUID v7 válido', () => {
    const uuid = generateUUIDv7();
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    expect(uuid).toMatch(uuidRegex);
  });

  it('deve gerar UUIDs únicos em chamadas consecutivas', () => {
    const uuid1 = generateUUIDv7();
    const uuid2 = generateUUIDv7();

    expect(uuid1).not.toBe(uuid2);
  });

  it('deve usar o timestamp atual na geração', () => {
    const mockDate = new Date('2025-01-01T00:00:00Z');
    const mockTimestamp = mockDate.getTime();

    vi.spyOn(Date, 'now').mockReturnValue(mockTimestamp);

    const uuid = generateUUIDv7();
    const timestampHex = mockTimestamp.toString(16).padStart(12, '0');

    expect(uuid.substring(0, 8)).toBe(timestampHex.substring(0, 8));

    vi.restoreAllMocks();
  });
});
