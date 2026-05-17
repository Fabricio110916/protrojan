export const config = {
  runtime: 'edge'
};

const BACKEND = 'https://my.koom.pp.ua';

export default async function handler(req) {
  try {
    const url = new URL(req.url);

    const target = `${BACKEND}${url.pathname}${url.search}`;

    const headers = new Headers(req.headers);

    headers.set('X-Forwarded-Host', url.host);
    headers.set('X-Forwarded-Proto', 'https');

    const response = await fetch(target, {
      method: req.method,
      headers,
      body:
        req.method !== 'GET' && req.method !== 'HEAD'
          ? req.body
          : undefined,
      redirect: 'manual'
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers
    });
  } catch (err) {
    return new Response('Proxy error', {
      status: 500
    });
  }
}
