import { StyleSheet, View, Text, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FlightDetail } from '../services/flightService';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

interface FlightMapProps {
  flightDetails: FlightDetail | undefined;
}

export const FlightMap = forwardRef<MapView, FlightMapProps>(({ flightDetails }, ref) => {
  const mapRef = useRef<MapView>(null);

  useImperativeHandle(ref, () => ({
    ...mapRef.current!,
    animateToRegion: (region: any, duration?: number) => {
      mapRef.current?.animateToRegion(region, duration);
    }
  }));

  const animateToFlight = () => {
    if (flightDetails?.trail && flightDetails.trail.length > 0) {
      const lastPosition = flightDetails.trail[0];
      mapRef.current?.animateToRegion({
        latitude: lastPosition.lat,
        longitude: lastPosition.lng,
        latitudeDelta: 2,
        longitudeDelta: 2,
      }, 1000);
    } else if (flightDetails) {
      // If no trail is available, show the route between airports
      const midLat = (flightDetails.airport.origin.position.latitude + flightDetails.airport.destination.position.latitude) / 2;
      const midLng = (flightDetails.airport.origin.position.longitude + flightDetails.airport.destination.position.longitude) / 2;
      const latDelta = Math.abs(flightDetails.airport.origin.position.latitude - flightDetails.airport.destination.position.latitude) * 1.5;
      const lngDelta = Math.abs(flightDetails.airport.origin.position.longitude - flightDetails.airport.destination.position.longitude) * 1.5;

      mapRef.current?.animateToRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(latDelta, 2),
        longitudeDelta: Math.max(lngDelta, 2),
      }, 1000);
    }
  };

  useEffect(() => {
    if (flightDetails) {
      animateToFlight();
    }
  }, [flightDetails]);

  return (
    <MapView
      key={flightDetails?.identification.id || 'default'}
      ref={mapRef}
      style={styles.map}
      initialRegion={{
        latitude: 48.8566,
        longitude: 2.3522,
        latitudeDelta: 15,
        longitudeDelta: 15,
      }}
    >
      {flightDetails?.trail && (
        <>
          <Polyline
            coordinates={flightDetails.trail.map(point => ({
              latitude: point.lat,
              longitude: point.lng,
            }))}
            strokeColor="#007AFF"
            strokeWidth={3}
          />
          <Marker
            coordinate={{
              latitude: flightDetails.trail[0].lat,
              longitude: flightDetails.trail[0].lng,
            }}
            title={flightDetails.identification.number.default}
            description={`Alt: ${flightDetails.trail[0].alt}ft, Speed: ${flightDetails.trail[0].spd}kts`}
          >
            <View style={styles.planeMarker}>
              <Text style={styles.planeMarkerText}>✈️</Text>
            </View>
          </Marker>
        </>
      )}
      {flightDetails && (
        <>
          <Polyline
            coordinates={[
              {
                latitude: flightDetails.airport.origin.position.latitude,
                longitude: flightDetails.airport.origin.position.longitude,
              },
              {
                latitude: flightDetails.airport.destination.position.latitude,
                longitude: flightDetails.airport.destination.position.longitude,
              },
            ]}
            strokeColor="#FF9500"
            strokeWidth={2}
          />
          <Marker
            coordinate={{
              latitude: flightDetails.airport.origin.position.latitude,
              longitude: flightDetails.airport.origin.position.longitude,
            }}
            title={flightDetails.airport.origin.name}
            description={`${flightDetails.airport.origin.code.iata} - ${flightDetails.airport.origin.position.region.city}`}
          >
            <View style={styles.airportMarker}>
              <Text style={styles.airportMarkerText}>🛫</Text>
            </View>
          </Marker>
          <Marker
            coordinate={{
              latitude: flightDetails.airport.destination.position.latitude,
              longitude: flightDetails.airport.destination.position.longitude,
            }}
            title={flightDetails.airport.destination.name}
            description={`${flightDetails.airport.destination.code.iata} - ${flightDetails.airport.destination.position.region.city}`}
          >
            <View style={styles.airportMarker}>
              <Text style={styles.airportMarkerText}>🛬</Text>
            </View>
          </Marker>
        </>
      )}
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  planeMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  planeMarkerText: {
    fontSize: 20,
  },
  airportMarker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  airportMarkerText: {
    fontSize: 16,
  },
}); 