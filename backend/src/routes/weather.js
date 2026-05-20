import { Router } from 'express';
import { buildMockResponse } from '../mock/data.js';

const router = Router();

router.get('/weather', async (req, res) => {
  const loc = typeof req.query.location === 'string' ? req.query.location.trim() : '';

  if (!loc) {
    res.status(400).json({ error: 'Missing required query parameter: location' });
    return;
  }

  await new Promise((r) => setTimeout(r, 300 + Math.random() * 500));

  res.json(buildMockResponse(loc));
});

export default router;
