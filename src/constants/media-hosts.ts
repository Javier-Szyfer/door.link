// Hosts `/api/download` is allowed to proxy from.

// Mixtapes predating the Supabase migration still live in the original S3 bucket.
const LEGACY_MEDIA_HOSTS = ["radio-strapi-bucket.s3.sa-east-1.amazonaws.com"];

export const getAllowedMediaHosts = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return LEGACY_MEDIA_HOSTS;

  try {
    return [new URL(supabaseUrl).hostname, ...LEGACY_MEDIA_HOSTS];
  } catch {
    return LEGACY_MEDIA_HOSTS;
  }
};

export const isAllowedMediaUrl = (url: string) => {
  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && getAllowedMediaHosts().includes(hostname);
  } catch {
    return false;
  }
};
