/**
 * Generates a UUID version 7 (UUIDv7) based on the current timestamp and random bytes.
 * @returns {string} A valid UUIDv7 string.
 */
function generateUUIDv7(): string {
  const now: number = Date.now();
  const timestampHex: string = now.toString(16).padStart(12, '0');
  const randomBytes: string = Array.from(
    crypto.getRandomValues(new Uint8Array(10)),
  )
    .map((byte: number) => byte.toString(16).padStart(2, '0'))
    .join('');
  let uuid: string = timestampHex + randomBytes;
  uuid = `${uuid.slice(0, 8)}-${uuid.slice(8, 12)}-${uuid.slice(12, 16)}-${uuid.slice(16, 20)}-${uuid.slice(20)}`;
  uuid = uuid.slice(0, 14) + '7' + uuid.slice(15);
  uuid = uuid.slice(0, 19) + '8' + uuid.slice(20);
  return uuid.toLowerCase();
}

export default generateUUIDv7;
