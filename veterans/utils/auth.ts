export function setupNextAuthUrl() {
  if (typeof window !== 'undefined') {
    return;
  }

  if (process.env.NEXTAUTH_URL) {
    return;
  }
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
    const vercelUrl = process.env.VERCEL_URL;
    if (vercelUrl?.trim()) {
      const isValidHostname = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*\.[a-zA-Z]{2,}$/.test(
        vercelUrl,
      );
      if (isValidHostname) {
        process.env.NEXTAUTH_URL = `https://${vercelUrl}`;
        return;
      }
    }
  }
  process.env.NEXTAUTH_URL = 'http://localhost:8000';
}
