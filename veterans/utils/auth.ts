export function setupNextAuthUrl() {
  if (typeof window === 'undefined' && !process.env.NEXTAUTH_URL) {
    if (process.env.VERCEL_URL && process.env.VERCEL_URL.trim() !== '') {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    } else {
      process.env.NEXTAUTH_URL = 'http://localhost:8000';
    }
  }
}
