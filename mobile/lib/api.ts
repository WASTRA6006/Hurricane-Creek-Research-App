export const getApiUrl = () => {
  // In production (Vercel), use Railway URL
  // In development (localhost), use local backend
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};