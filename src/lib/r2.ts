import { AwsClient } from "aws4fetch";

const requireEnv = (name: string) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
};

export const getMediaBucket = () => requireEnv("R2_MEDIA_BUCKET");
export const getDataBucket = () => requireEnv("R2_DATA_BUCKET");

let client: AwsClient | undefined;

const getClient = () => {
  client ??= new AwsClient({
    accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    service: "s3",
    region: "auto",
  });
  return client;
};

// Percent-encodes each path segment of an object key.
const encodeKey = (key: string) => key.split("/").map(encodeURIComponent).join("/");

const objectUrl = (bucket: string, key: string) =>
  `https://${requireEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com/${bucket}/${encodeKey(key)}`;

// Sends a signed S3 request for one object.
export const r2Fetch = (bucket: string, key: string, init?: RequestInit) =>
  getClient().fetch(objectUrl(bucket, key), init);

// Returns a URL that lets the holder PUT one object with exactly these headers.
export const presignPut = async (
  bucket: string,
  key: string,
  headers: Record<string, string>,
  expiresInSeconds = 3600,
) => {
  const url = new URL(objectUrl(bucket, key));
  url.searchParams.set("X-Amz-Expires", String(expiresInSeconds));
  const signed = await getClient().sign(url, {
    method: "PUT",
    headers,
    aws: { signQuery: true },
  });
  return signed.url;
};

// Public URL of a media object, served from the bucket's custom domain.
export const getPublicMediaUrl = (key: string) =>
  `${requireEnv("NEXT_PUBLIC_MEDIA_URL").replace(/\/$/, "")}/${encodeKey(key)}`;
