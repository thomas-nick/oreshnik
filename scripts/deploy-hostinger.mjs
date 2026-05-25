/**
 * Deploy a pre-built static site (dist/) to Hostinger.
 * Env: HOSTINGER_API_TOKEN, HOSTINGER_DOMAIN, ARCHIVE (path to zip)
 */
import fs from 'node:fs';
import path from 'node:path';
import { Upload } from 'tus-js-client';

const API_BASE = 'https://developers.hostinger.com/';

const token = process.env.HOSTINGER_API_TOKEN;
const domain = process.env.HOSTINGER_DOMAIN;
const archivePath = process.env.ARCHIVE;

if (!token || !domain || !archivePath) {
  console.error(
    'Missing env: HOSTINGER_API_TOKEN, HOSTINGER_DOMAIN, and ARCHIVE are required.',
  );
  process.exit(1);
}

if (!fs.existsSync(archivePath)) {
  console.error(`Archive not found: ${archivePath}`);
  process.exit(1);
}

async function api(pathname, { method = 'GET', body } = {}) {
  const url = new URL(pathname, API_BASE).toString();
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `Hostinger API ${method} ${pathname} → ${res.status}: ${text}`,
    );
  }
  return text ? JSON.parse(text) : null;
}

async function resolveUsername() {
  const data = await api(
    `api/hosting/v1/websites?domain=${encodeURIComponent(domain)}`,
  );
  const username = data?.data?.[0]?.username;
  if (!username) throw new Error(`No Hostinger account found for ${domain}`);
  return username;
}

async function fetchUploadCredentials(username) {
  const creds = await api('api/hosting/v1/files/upload-urls', {
    method: 'POST',
    body: { username, domain },
  });
  return {
    uploadUrl: creds.url,
    authToken: creds.auth_key,
    authRestToken: creds.rest_auth_key,
  };
}

function uploadArchive(filePath, uploadUrl, authToken, authRestToken) {
  const basename = path.basename(filePath);
  const stats = fs.statSync(filePath);
  const cleanUploadUrl = uploadUrl.replace(/\/$/, '');
  const uploadUrlWithFile = `${cleanUploadUrl}/${basename}?override=true`;
  const headers = {
    'X-Auth': authToken,
    'X-Auth-Rest': authRestToken,
    'upload-length': String(stats.size),
    'upload-offset': '0',
  };

  return new Promise((resolve, reject) => {
    (async () => {
      const pre = await fetch(uploadUrlWithFile, { method: 'POST', headers });
      if (pre.status !== 201) {
        reject(new Error(`Pre-upload failed (${pre.status}): ${await pre.text()}`));
        return;
      }

      const stream = fs.createReadStream(filePath);
      const upload = new Upload(stream, {
        uploadUrl: uploadUrlWithFile,
        retryDelays: [1000, 2000, 4000, 8000, 16000],
        uploadDataDuringCreation: false,
        parallelUploads: 1,
        chunkSize: 10 * 1024 * 1024,
        headers,
        removeFingerprintOnSuccess: true,
        uploadSize: stats.size,
        metadata: { filename: basename },
        onError: reject,
        onSuccess: () => resolve(basename),
      });
      upload.start();
    })().catch(reject);
  });
}

async function triggerDeploy(username, archiveBasename) {
  return api(
    `api/hosting/v1/accounts/${username}/websites/${domain}/deploy`,
    { method: 'POST', body: { archive_path: archiveBasename } },
  );
}

async function main() {
  const username = await resolveUsername();
  const { uploadUrl, authToken, authRestToken } =
    await fetchUploadCredentials(username);
  const basename = await uploadArchive(
    archivePath,
    uploadUrl,
    authToken,
    authRestToken,
  );
  const result = await triggerDeploy(username, basename);
  console.log('Deploy accepted:', JSON.stringify(result, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
