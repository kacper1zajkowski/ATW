import { Router } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

const FORWARD_RESPONSE_HEADERS = ['content-type', 'x-correlation-id', 'x-apigee-cache'];

async function pipe(req, res, upstream) {
  const correlationId = req.get('x-correlation-id') ?? randomUUID();
  const headers = {
    'x-api-key': process.env.APIGEE_API_KEY,
    'x-correlation-id': correlationId,
    accept: 'application/json',
  };
  const init = { method: req.method, headers };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    headers['content-type'] = 'application/json';
    init.body = JSON.stringify(req.body ?? {});
  }

  try {
    const upstreamRes = await fetch(upstream, init);
    for (const h of FORWARD_RESPONSE_HEADERS) {
      const v = upstreamRes.headers.get(h);
      if (v) res.setHeader(h, v);
    }
    if (!res.getHeader('x-correlation-id')) res.setHeader('x-correlation-id', correlationId);
    const body = await upstreamRes.text();
    res.status(upstreamRes.status).send(body);
  } catch (err) {
    res.status(502).json({
      error: 'Gateway unreachable',
      detail: err.message,
      correlationId,
    });
  }
}

router.get('/weather', (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
  if (!q) return res.status(400).json({ error: 'Missing required query parameter: q' });
  return pipe(req, res, `${process.env.APIGEE_BASE_URL}/v1/weather?q=${encodeURIComponent(q)}`);
});

router.post('/forecast-summary', (req, res) => {
  return pipe(req, res, `${process.env.APIGEE_BASE_URL}/v1/forecast-summary`);
});

export default router;
