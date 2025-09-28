import * as crypto from 'crypto';

export function generateCacheKey(base: string, filters: object): string {
  const hash = crypto.createHash('md5').update(JSON.stringify(filters)).digest('hex');
  return `${base}:${hash}`;
}
