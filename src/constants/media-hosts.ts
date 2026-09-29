// Hosts `/api/download` is allowed to proxy from.

// Mixtapes predating the Supabase migration still live in the original S3 bucket.
const LEGACY_MEDIA_HOSTS = ["radio-strapi-bucket.s3.sa-east-1.amazonaws.com"];

const getSupabaseHost = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  try {
    return new URL(supabaseUrl).hostname;
  } catch {
    return null;
  }
};

export const getAllowedMediaHosts = () => {
  const supabaseHost = getSupabaseHost();
  return supabaseHost ? [supabaseHost, ...LEGACY_MEDIA_HOSTS] : LEGACY_MEDIA_HOSTS;
};

export const isSupabaseStorageUrl = (url: string) => {
  const supabaseHost = getSupabaseHost();
  if (!supabaseHost) return false;

  try {
    const { protocol, hostname } = new URL(url);
    return protocol === "https:" && hostname === supabaseHost;
  } catch {
    return false;
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

// Supabase Storage sets Content-Disposition from `?download`, so those files are
// fetched straight from its CDN — no proxying ~100MB through a serverless
// function. The legacy S3 bucket rejects the equivalent parameter on unsigned
// requests, so those still go through /api/download.
export const getDownloadUrl = (audioUri: string, filename: string) => {
  if (isSupabaseStorageUrl(audioUri)) {
    const url = new URL(audioUri);
    url.searchParams.set("download", filename);
    return url.toString();
  }

  return `/api/download?url=${encodeURIComponent(audioUri)}&filename=${encodeURIComponent(filename)}`;
};
