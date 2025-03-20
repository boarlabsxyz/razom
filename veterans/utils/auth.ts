export function setupNextAuthUrl() {
  if (typeof window !== 'undefined') {
    return;
  }
  if (process.env.NEXTAUTH_URL) {
    return;
  }

  try {
    if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
      const vercelUrl = process.env.VERCEL_URL;
      if (vercelUrl && vercelUrl.trim()) {
        new URL(`https://${vercelUrl}`);
        process.env.NEXTAUTH_URL = `https://${vercelUrl}`;
        return;
      }
    }
    process.env.NEXTAUTH_URL = 'http://localhost:8000';
  } catch {
    process.env.NEXTAUTH_URL = 'http://localhost:8000';
  }
}
