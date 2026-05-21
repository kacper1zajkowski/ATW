import { useState, useCallback } from 'react';
import { fetchWeatherData, fetchForecastSummary, ApiError } from '../api/weather';

export function useWeatherData() {
  const [state, setState] = useState({ status: 'idle' });

  const search = useCallback(async (location) => {
    if (!location.trim()) return;
    setState({ status: 'loading' });
    try {
      const data = await fetchWeatherData(location.trim());
      setState({ status: 'success', data });

      fetchForecastSummary(data.location, data.forecast).then(summary => {
        if (summary) {
          setState(prev => prev.status === 'success'
            ? { ...prev, data: { ...prev.data, forecast_summary: summary } }
            : prev
          );
        }
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setState({ status: 'error', message: err.message, code: err.status });
      } else {
        setState({ status: 'error', message: 'Network error — is the backend running?' });
      }
    }
  }, []);

  return { state, search };
}
