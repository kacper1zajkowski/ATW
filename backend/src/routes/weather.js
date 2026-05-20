import { Router } from 'express';

const router = Router();

router.get('/weather', async (req, res) => {
  const loc = typeof req.query.location === 'string' ? req.query.location.trim() : '';

  if (!loc) {
    res.status(400).json({ error: 'Missing required query parameter: location' });
    return;
  }

  res.status(501).json({ error: 'Weather API not yet connected. Configure Apigee endpoints first.' });
});

router.post('/forecast-summary', async (req, res) => {
  res.status(501).json({ error: 'Gemini API not yet connected. Configure Apigee endpoints first.' });
});

export default router;
