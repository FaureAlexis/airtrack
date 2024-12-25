import { useQuery } from '@tanstack/react-query';

const RAPID_API_KEY = '26dc595410mshaa82e460ecba4fep11f787jsnffeb0eca3554';
const RAPID_API_HOST = 'flight-radar1.p.rapidapi.com';

export interface Flight {
  id: string;
  label: string;
  detail: {
    lat: number;
    lng: number;
    alt: number;
    speed: number;
  };
}

const searchFlightsApi = async (query: string): Promise<Flight[]> => {
  const response = await fetch(
    `https://flight-radar1.p.rapidapi.com/flights/search?query=${query}&limit=25`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  
  return data.map((flight: any) => ({
    id: flight.id || String(Math.random()),
    label: flight.label || flight.detail?.callsign || 'Unknown',
    detail: {
      lat: flight.detail?.lat || 0,
      lng: flight.detail?.lng || 0,
      alt: flight.detail?.alt || 0,
      speed: flight.detail?.speed || 0,
    },
  }));
};

export const useSearchFlights = (query: string) => {
  return useQuery({
    queryKey: ['flights', query],
    queryFn: () => searchFlightsApi(query),
    enabled: !!query.trim(),
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in garbage collection for 5 minutes
  });
}; 