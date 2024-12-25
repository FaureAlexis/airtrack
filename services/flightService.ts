import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';

const RAPID_API_KEY = Constants.expoConfig?.extra?.rapidApiKey;
const RAPID_API_HOST = 'flight-radar1.p.rapidapi.com';

interface ApiResponse {
  results: Array<{
    id: string;
    label: string;
    detail: {
      operator_id?: number;
      iata?: string;
      logo?: string;
      callsign?: string;
      flight?: string;
      operator?: string;
    };
    type: 'operator' | 'schedule' | 'live' | 'airport' | 'aircraft';
  }>;
  stats: {
    total: {
      all: number;
      airport: number;
      operator: number;
      live: number;
      schedule: number;
      aircraft: number;
    };
  };
}

export interface Flight {
  id: string;
  label: string;
  type: string;
  detail: {
    callsign?: string;
    flight?: string;
    operator?: string;
    logo?: string;
  };
}

export interface FlightDetail {
  identification: {
    id: string;
    number: {
      default: string;
      alternative: string | null;
    };
    callsign: string;
  };
  status: {
    live: boolean;
    text: string;
    icon: string | null;
    generic: {
      status: {
        text: string;
        color: string;
        type: string;
      };
    };
  };
  aircraft: {
    model: {
      code: string;
      text: string;
    };
    registration: string;
    images?: {
      thumbnails: Array<{
        src: string;
        link: string;
        copyright: string;
        source: string;
      }>;
      medium: Array<{
        src: string;
        link: string;
        copyright: string;
        source: string;
      }>;
      large: Array<{
        src: string;
        link: string;
        copyright: string;
        source: string;
      }>;
    };
  };
  airline: {
    name: string;
    code: {
      iata: string;
      icao: string;
    };
  };
  airport: {
    origin: {
      name: string;
      code: {
        iata: string;
        icao: string;
      };
      position: {
        latitude: number;
        longitude: number;
        altitude: number;
        country: {
          name: string;
          code: string;
        };
        region: {
          city: string;
        };
      };
    };
    destination: {
      name: string;
      code: {
        iata: string;
        icao: string;
      };
      position: {
        latitude: number;
        longitude: number;
        altitude: number;
        country: {
          name: string;
          code: string;
        };
        region: {
          city: string;
        };
      };
    };
  };
  time: {
    scheduled: {
      departure: number;
      arrival: number;
    };
    real: {
      departure: number | null;
      arrival: number | null;
    };
    estimated: {
      departure: number | null;
      arrival: number | null;
    };
  };
  trail?: Array<{
    lat: number;
    lng: number;
    alt: number;
    spd: number;
    ts: number;
    hd: number;
  }>;
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

  const data: ApiResponse = await response.json();
  
  return data.results.map((result) => ({
    id: result.id,
    label: result.label,
    type: result.type,
    detail: {
      callsign: result.detail.callsign,
      flight: result.detail.flight,
      operator: result.detail.operator,
      logo: result.detail.logo,
    },
  }));
};

export const useSearchFlights = (query: string) => {
  return useQuery({
    queryKey: ['flights', query],
    queryFn: () => searchFlightsApi(query),
    enabled: !!query.trim(),
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
};

const getFlightDetailsApi = async (flightId: string): Promise<FlightDetail> => {
  console.log('Getting details for flight:', flightId);
  const response = await fetch(
    `https://flight-radar1.p.rapidapi.com/flights/detail?flight=${flightId}`,
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

  return data;
};

export const useFlightDetails = (flightId: string | null) => {
  return useQuery({
    queryKey: ['flightDetail', flightId],
    queryFn: () => getFlightDetailsApi(flightId!),
    enabled: !!flightId,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });
}; 