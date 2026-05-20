export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchWeatherData(location) {
  const res = await fetch(`/api/weather?location=${encodeURIComponent(location)}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error ?? `Server returned ${res.status}`, res.status);
  }

  return res.json();
}
