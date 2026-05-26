export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchWeatherData(query) {
  const res = await fetch(`/api/v1/weather?q=${encodeURIComponent(query)}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Server returned ${res.status}`, res.status);
  }

  return res.json();
}

export async function fetchForecastSummary(location, forecast) {
  const res = await fetch('/api/v1/forecast-summary', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location, forecast }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.summary ?? null;
}
